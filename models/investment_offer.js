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

    InvestmentOffer.calculateTotalOfferedByStatus = async function(investorId) {
        // Fetch aggregate data from the database
        const results = await this.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('offered_amount')), 'totalOfferedAmount']
            ],
            where: { investor_id: investorId },
            group: ['status']
        });

        // Initialize with all statuses, setting default values to zero
        const statusSummary = {
            pending: { status: 'pending', count: 0, totalOfferedAmount: 0.00 },
            accepted: { status: 'accepted', count: 0, totalOfferedAmount: 0.00 },
            rejected: { status: 'rejected', count: 0, totalOfferedAmount: 0.00 }
        };

        // Update the summary with actual data
        results.forEach(row => {
            const { status, count, totalOfferedAmount } = row.dataValues;
            statusSummary[status] = {
                status,
                count: parseInt(count, 10) || 0,
                totalOfferedAmount: parseFloat(totalOfferedAmount) || 0.00
            };
        });

        // Convert the object to an array
        return Object.values(statusSummary);
    };

    return InvestmentOffer;
}