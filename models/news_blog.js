module.exports = (sequelize, DataTypes) => {
    const NewsBlog = sequelize.define('news_blog', {
        title: {
            type: DataTypes.CHAR(255)
        },
        content: {
            type: DataTypes.TEXT
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    // NewsBlog.belongsTo(sequelize.models.user, {
    //     foreignKey: 'author_id',
    //     as: 'author'
    // });

    return NewsBlog;
}