module.exports = (sequelize, DataTypes) => {
    const BusinessPerformance = sequelize.define('business_performance', {
        business_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE
        },
        profit: {
            type: DataTypes.DECIMAL(15, 2)
        },
        loss: {
            type: DataTypes.DECIMAL(15, 2)
        }
    }, {
        timestamps: true
    });

    // BusinessPerformance.belongsTo(sequelize.models.business, {
    //     foreignKey: 'business_id',
    //     as: 'business'
    // });

    return BusinessPerformance;
}