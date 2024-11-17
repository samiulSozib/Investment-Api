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
            type: DataTypes.ENUM('active','inactive', 'terminated', 'completed')
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

    Investment.calculateInvestmentSummaryByStatus = async function(userId) {
        // Query to get the count and total amount for each status
        const results = await this.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
            ],
            where: { user_id: userId },
            group: ['status']
        });

        // Initialize the status summary object with default values
        const statusSummary = {
            active: { status: 'active', count: 0, totalAmount: 0.00 },
            completed: { status: 'completed', count: 0, totalAmount: 0.00 },
            terminated: { status: 'terminated', count: 0, totalAmount: 0.00 },
            inactive: { status: 'inactive', count: 0, totalAmount: 0.00 }
        };

        // Populate the status summary with the actual data from the query results
        results.forEach(row => {
            const { status, count, totalAmount } = row.dataValues;
            statusSummary[status] = {
                status,
                count: parseInt(count, 10) || 0,
                totalAmount: parseFloat(totalAmount) || 0.00
            };
        });

        // Return the summary as an array of status objects
        return Object.values(statusSummary);
    };

    return Investment;
}