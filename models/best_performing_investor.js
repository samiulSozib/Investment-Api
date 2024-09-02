module.exports = (sequelize, DataTypes) => {
    const BestPerformingInvestor = sequelize.define('best_performing_investor', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        performance_score: {
            type: DataTypes.DECIMAL(5, 2)
        }
    }, {
        timestamps: true
    });


    // BestPerformingInvestor.belongsTo(sequelize.models.user, {
    //     foreignKey: 'user_id',
    //     as: 'user'
    // });

    return BestPerformingInvestor;
}