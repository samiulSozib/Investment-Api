module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        name: {
            type: DataTypes.TEXT
        },
        email: {
            type: DataTypes.CHAR(255)
        },
        password: {
            type: DataTypes.TEXT
        },
        phone_number: {
            type: DataTypes.CHAR(15)
        },
        role: {
            type: DataTypes.ENUM('admin', 'entrepreneur', 'investor'), 
            allowNull: false
        },
        is_verified:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    }, {
        timestamps: true
    })


    // User.hasMany(sequelize.models.investment_request, {
    //     foreignKey: 'user_id',
    //     as: 'investmentRequests'
    // });

    // User.hasMany(sequelize.models.investment, {
    //     foreignKey: 'user_id',
    //     as: 'investments'
    // });

    // User.hasMany(sequelize.models.news_blog, {
    //     foreignKey: 'author_id',
    //     as: 'newsBlogs'
    // });

    // User.hasMany(sequelize.models.best_performing_investor, {
    //     foreignKey: 'user_id',
    //     as: 'bestPerformingInvestors'
    // });

    return User;
}
