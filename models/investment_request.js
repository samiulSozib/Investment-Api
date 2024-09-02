module.exports = (sequelize, DataTypes) => {
    const InvestmentRequest = sequelize.define('investment_request', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        business_name: {
            type: DataTypes.CHAR(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        requested_amount: {
            type: DataTypes.DECIMAL(15, 2)
        },
        proposed_share: {
            type: DataTypes.DECIMAL(5, 2)
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected')
        }
    }, {
        timestamps: true
    });

    // InvestmentRequest.belongsTo(sequelize.models.user, {
    //     foreignKey: 'user_id',
    //     as: 'user'
    // });

    // InvestmentRequest.hasMany(sequelize.models.investment_offer, {
    //     foreignKey: 'request_id',
    //     as: 'investmentOffers'
    // });

    return InvestmentRequest;
}