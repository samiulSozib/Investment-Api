module.exports = (sequelize, DataTypes) => {
    const InvestmentOffer = sequelize.define('investment_offer', {
        request_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        investor_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        offered_amount: {
            type: DataTypes.DECIMAL(15, 2)
        },
        proposed_share: {
            type: DataTypes.DECIMAL(5, 2)
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected')
        }
    }, {
        timestamps: true
    });


    // InvestmentOffer.belongsTo(sequelize.models.investment_request, {
    //     foreignKey: 'request_id',
    //     as: 'investmentRequest'
    // });

    // InvestmentOffer.belongsTo(sequelize.models.user, {
    //     foreignKey: 'investor_id',
    //     as: 'investor'
    // });

    return InvestmentOffer;
}