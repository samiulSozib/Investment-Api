module.exports = (sequelize, DataTypes) => {
    const Business = sequelize.define('business', {
        name: {
            type: DataTypes.CHAR(255),
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        min_investment: {
            type: DataTypes.DECIMAL(15, 2)
        },
        max_investment: {
            type: DataTypes.DECIMAL(15, 2)
        },
        min_investment_period: {
            type: DataTypes.INTEGER
        },
        max_investment_period: {
            type: DataTypes.INTEGER
        },
        profit_share_ratio: {
            type: DataTypes.DECIMAL(5, 2)
        },
        loss_share_ratio: {
            type: DataTypes.DECIMAL(5, 2)
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'closed')
        }
    }, {
        timestamps: true
    });

    // Business.belongsTo(sequelize.models.business_category, {
    //     foreignKey: 'category_id',
    //     as: 'category'
    // });

    // Business.hasMany(sequelize.models.investment, {
    //     foreignKey: 'business_id',
    //     as: 'investments'
    // });

    // Business.hasMany(sequelize.models.business_performance, {
    //     foreignKey: 'business_id',
    //     as: 'performances'
    // });

    // Business.hasOne(sequelize.models.best_performing_business, {
    //     foreignKey: 'business_id',
    //     as: 'bestPerformance'
    // });

    return Business;
}