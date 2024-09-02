module.exports = (sequelize, DataTypes) => {
    const Investment = sequelize.define('investment', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        business_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2)
        },
        investment_date: {
            type: DataTypes.DATE
        },
        investment_period: {
            type: DataTypes.INTEGER
        },
        expected_return: {
            type: DataTypes.DECIMAL(15, 2)
        },
        termination_date: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.ENUM('active', 'terminated', 'completed')
        }
    }, {
        timestamps: true
    });

    // Investment.belongsTo(sequelize.models.user, {
    //     foreignKey: 'user_id',
    //     as: 'user'
    // });

    // Investment.belongsTo(sequelize.models.business, {
    //     foreignKey: 'business_id',
    //     as: 'business'
    // });

    // Investment.hasOne(sequelize.models.contract, {
    //     foreignKey: 'investment_id',
    //     as: 'contract'
    // });

    return Investment;
}