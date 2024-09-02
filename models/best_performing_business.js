module.exports = (sequelize, DataTypes) => {
    const BestPerformingBusiness = sequelize.define('best_performing_business', {
        business_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        performance_score: {
            type: DataTypes.DECIMAL(5, 2)
        }
    }, {
        timestamps: true
    });

    // BestPerformingBusiness.belongsTo(sequelize.models.business, {
    //     foreignKey: 'business_id',
    //     as: 'business'
    // });

    return BestPerformingBusiness;
}