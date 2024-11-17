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

    InvestmentRequest.calculateRequestedAmountByStatus = async function(userId) {
        const results = await this.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('requested_amount')), 'totalRequestedAmount']
            ],
            where: { user_id: userId },
            group: ['status']
        });

        // Initialize with all statuses, setting default values to zero
        const statusSummary = {
            pending: { status: 'pending', count: 0, totalRequestedAmount: 0.00 },
            approved: { status: 'approved', count: 0, totalRequestedAmount: 0.00 },
            rejected: { status: 'rejected', count: 0, totalRequestedAmount: 0.00 }
        };

        // Update the summary with actual data
        results.forEach(row => {
            const { status, count, totalRequestedAmount } = row.dataValues;
            statusSummary[status] = {
                status,
                count: parseInt(count, 10) || 0,
                totalRequestedAmount: parseFloat(totalRequestedAmount) || 0.00
            };
        });

        // Convert the object to an array
        return Object.values(statusSummary);
    };

    

    return InvestmentRequest;
}