module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define('currency', {
        name: {
            type:DataTypes.CHAR(60)
        },
        code: {
            type:DataTypes.CHAR(15)
        },
        symbol: {
            type:DataTypes.CHAR(10)
        },
        ignore_digits_count: {
            type:DataTypes.CHAR(10)
        },
        exchange_rate_per_usd: {
            type:DataTypes.CHAR(60)
        },
    }, {
        timestamps: true
    })


    return Currency;
}
