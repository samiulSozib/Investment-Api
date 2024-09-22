module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        entry_type: {
            type: DataTypes.ENUM('user', 'business', 'newsBlogs','investmentRequests'), 
            allowNull: false
        },
        foreign_key_id: {
            type: DataTypes.INTEGER
        },
        image_url: {
            type: DataTypes.TEXT
        },
    }, {
        timestamps: true
    })


    return Image;
}
