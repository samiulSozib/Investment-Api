module.exports = (sequelize, DataTypes) => {
    const BusinessCategory = sequelize.define('business_categories', {
        name: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true
    })

    // BusinessCategory.hasMany(sequelize.models.business, {
    //     foreignKey: 'category_id',
    //     as: 'businesses'
    // });

    
    return BusinessCategory;
}
