module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define('contract', {
        investment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        terms: {
            type: DataTypes.TEXT
        },
        start_date: {
            type: DataTypes.DATE
        },
        end_date: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.ENUM('active', 'Terminated', 'completed')
        }
    }, {
        timestamps: true
    });

    // Contract.belongsTo(sequelize.models.investment, {
    //     foreignKey: 'investment_id',
    //     as: 'investment'
    // });

    return Contract;
}