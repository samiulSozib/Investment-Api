module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('user_role', {
        user_id:{
            type:DataTypes.INTEGER,
            
        },
        role: {
            type: DataTypes.ENUM('admin', 'entrepreneur', 'investor'), 
            
        }
    }, {
        timestamps: true
    })


    return UserRole;
}
