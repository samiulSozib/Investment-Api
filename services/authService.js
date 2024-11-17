const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db=require('../database/db')
const {generateOtp,isOtpExpired}=require('../util/otpFuntions')
const {sendEmail}=require('../services/emailService')
const {Op, where}=require('sequelize')


// register user
const registerUser = async ({ name, email, password }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const existingUser = await db.User.findOne({
            where: { email },
            transaction
        });
       

        // Check if user exists and is verified
        if (existingUser && existingUser.is_verified) {
            throw new Error('User already exists');
        }

        // If user exists but is not verified, update the user details and hash the password
        if (existingUser && !existingUser.is_verified) {
            const hashedPassword = await bcrypt.hash(password, 10);

            await db.User.update({
                name,
                password: hashedPassword,
                is_verified: 0 // Ensure the user is marked as not verified
            }, {
                where: { email },
                transaction
            });

            const updatedUser = await db.User.findOne({
                where: { email },
                
                transaction
            });

            // Check OTP requests for the past 24 hours
            const now = new Date();
            const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

            const otpCountToday = await db.OTP.count({
                where: {
                    user_id: updatedUser.id,
                    createdAt: {
                        [Op.gt]: twentyFourHoursAgo,
                    },
                },
                transaction
            });

            if (otpCountToday >= 5) {
                throw new Error('OTP request limit reached for today for this email');
            }

            // Generate and send new OTP
            const created_otp = generateOtp();
            await db.OTP.create({
                user_id: updatedUser.id,
                otp: created_otp,
                daily_otp_count: otpCountToday + 1
            }, { transaction });

            await sendEmail(updatedUser.email, 'Verify Email', `Your OTP is ${created_otp}`);

            await transaction.commit();
            return updatedUser;
        }

        // If user doesn't exist, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.User.create({
            name,
            email,
            password: hashedPassword,
            is_verified: 0 // Ensure the user is marked as not verified
        }, { transaction });

        // Check OTP requests for the past 24 hours
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

        const otpCountToday = await db.OTP.count({
            where: {
                user_id: newUser.id,
                createdAt: {
                    [Op.gt]: twentyFourHoursAgo,
                },
            },
            transaction
        });

        if (otpCountToday >= 5) {
            throw new Error('OTP request limit reached for today for this email');
        }

        // Generate and send new OTP
        const created_otp = generateOtp();
        await db.OTP.create({
            user_id: newUser.id,
            otp: created_otp,
            daily_otp_count: 1
        }, { transaction });

        await sendEmail(newUser.email, 'Verify Email', `Your OTP is ${created_otp}`);

        await transaction.commit();
        return newUser;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// login user
const loginUser = async ({ email, password }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({ where: { email },include:[{model:db.UserRole,as:'user_role',required:false}], transaction });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.id,email:user.email},
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        await transaction.commit(); 
        return { token, user };
    } catch (error) {
        await transaction.rollback(); 
        throw error;
    }
};


// verify user
const verifyUser = async ({ user_id, otp }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const otpRecord = await db.OTP.findOne({
            where: { user_id, otp },
            order: [['createdAt', 'DESC']],
            transaction,
        });

        if (!otpRecord) {
            throw new Error('Invalid OTP');
        }

        if (isOtpExpired(otpRecord.createdAt)) {
            throw new Error('OTP has expired');
        }

        await db.User.update(
            { is_verified: 1 },
            { where: { id: user_id }, transaction }
        );

        const user_data = await db.User.findByPk(user_id, {
            include:[
                {
                    model:db.UserRole,
                    as:'user_role',
                    required:false
                }
            ],
            transaction,
        });

        const token = jwt.sign({ user_id: user_data.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        await transaction.commit();
        return { token, user: user_data };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


// resend otp
const resendOTP = async ({ user_id }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000); // 24 hours ago

        // Count OTPs sent in the last 24 hours
        const otpCountToday = await db.OTP.count({
            where: {
                user_id: user_id,
                createdAt: {
                    [Op.gt]: twentyFourHoursAgo,
                },
            },
            transaction,
        });

        // Check if the user has exceeded the OTP request limit
        if (otpCountToday >= 5) {
            throw new Error('OTP request limit reached for today');
        }

        // Fetch user data
        const user_data = await db.User.findByPk(user_id, {
            include:[
                {
                    model:db.UserRole,
                    as:'user_data',
                    required:false
                }
            ],
            transaction,
        });

        if (!user_data) {
            throw new Error('User not found');
        }

        // Generate new OTP and save it to the database
        const created_otp = generateOtp();
        await db.OTP.create({
            user_id: user_data.id,
            otp: created_otp,
            daily_otp_count: otpCountToday + 1,
        }, { transaction });

        // Send OTP via email
        await sendEmail(user_data.email, 'Verify Email', `Your OTP is ${created_otp}`);

        await transaction.commit();
        return user_data;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// resend otp
const sendOTPForForgetPassword = async ({ email }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const user=await db.User.findOne({where:{email:email}})
        if(!email) throw new Error("User Not Found, Invalid Email")
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000); // 24 hours ago

        // Count OTPs sent in the last 24 hours
        const otpCountToday = await db.OTP.count({
            where: {
                user_id: user.id,
                createdAt: {
                    [Op.gt]: twentyFourHoursAgo,
                },
            },
            transaction,
        });

        // Check if the user has exceeded the OTP request limit
        if (otpCountToday >= 5) {
            throw new Error('OTP request limit reached for today');
        }

        // Fetch user data
        // const user_data = await db.User.findByPk(user.id, {
        //     include:[
        //         {
        //             model:db.UserRole,
        //             as:'user_data',
        //             required:false
        //         }
        //     ],
        //     transaction,
        // });
        // if (!user_data) {
        //     throw new Error('User not found');
        // }

        // Generate new OTP and save it to the database
        const created_otp = generateOtp();
        await db.OTP.create({
            user_id: user.id,
            otp: created_otp,
            daily_otp_count: otpCountToday + 1,
        }, { transaction });

        // Send OTP via email
        await sendEmail(email, 'Verify Email', `Your OTP is ${created_otp}`);

        await transaction.commit();
        return user;
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        throw error;
    }
};

const verifyUserForForgotPassword = async ({ email, otp }) => {
    const transaction = await db.sequelize.transaction();

    try {
        const user=await db.User.findOne({where:{email:email}})
        if(!user) throw new Error('User not found, Invalid Email')
        // Find the latest OTP record for the user
        const otpRecord = await db.OTP.findOne({
            where: { user_id: user.id, otp },
            order: [['createdAt', 'DESC']],
            transaction,
        });

        // If OTP record is not found
        if (!otpRecord) {
            throw new Error('Invalid OTP');
        }

        // Check if the OTP has expired
        if (isOtpExpired(otpRecord.createdAt)) {
            throw new Error('OTP has expired');
        }

        // Fetch user data
        const user_data = await db.User.findByPk(user.id, {
            include:[
                {
                    model:db.UserRole,
                    as:'user_role',
                    required:false
                }
            ],
            transaction,
        });

        if (!user_data) {
            throw new Error('User not found');
        }

        await transaction.commit();
        return user_data;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


// update user profile
const updateUserProfile = async (userId, updatedData,imageFile) => {
    const transaction = await db.sequelize.transaction(); 
    try {
        const user = await db.User.findByPk(userId, { transaction: transaction }); 
        if (!user) {
            throw new Error('User not found');
        }
       
        if (updatedData.name) {
            user.name = updatedData.name;
        }
        if (updatedData.phone_number) {
            user.phone_number = updatedData.phone_number;
        }
        

      
        await user.save({ transaction: transaction });

        if (imageFile) {
            const imageUrl = `${process.env.base_url}/uploads/${imageFile.filename}`;

            // Check if the user already has an image and update it, or insert a new one
            const existingImage = await db.Image.findOne({
                where: {
                    foreign_key_id: userId,
                    entry_type: 'user'
                },
                transaction
            });

            if (existingImage) {
                // Update existing image
                existingImage.image_url = imageUrl;
                await existingImage.save({ transaction });
            } else {
                // Insert new image
                await db.Image.create({
                    entry_type: 'user',
                    foreign_key_id: userId,
                    image_url: imageUrl
                }, { transaction });
            }
        }

        const updatedUser = await db.User.findByPk(userId, {
            include: 
            [
                {
                    model: db.Image,
                    as: 'profile_image',
                    where: {foreign_key_id:userId, entry_type: 'user' },
                    required: false 
                },
                {
                    model:db.UserRole,
                    as:'user_role',
                    required:false
                }
            ]
        });
        

        await transaction.commit(); 
        return updatedUser; 
    } catch (error) {
        await transaction.rollback(); 
        throw new Error(error.message);
    }
};

const changePassword=async(user_id,old_password,new_password)=>{
    try {
        const user = await db.User.findByPk(user_id);
        if (!user) throw new Error('User not found');

        // Verify old password
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) throw new Error('Incorrect old password');

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();
        const updatedUser=await db.User.findByPk(user_id)
        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
}

const setNewPasswordPassword=async(user_id,new_password)=>{
    try {
        const user = await db.User.findByPk(user_id);
        if (!user) throw new Error('User not found');

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        await user.save();
        const updatedUser=await db.User.findByPk(user_id)
        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
}



module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    resendOTP,
    sendOTPForForgetPassword,
    verifyUserForForgotPassword,
    updateUserProfile,
    changePassword,
    setNewPasswordPassword
};
