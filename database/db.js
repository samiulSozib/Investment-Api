const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('investment_project', 'root', '', {
    host: 'localhost',
    logging: true,
    dialect: 'mysql',
    pool: { max: 5, min: 0, idle: 10000 }
})

sequelize.authenticate()
    .then(() => {
        console.log('databse connect success')
    })
    .catch(error => {
        console.log('error ' + error)
    })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('sync databse')
    })
    .catch(e => {
        console.log(e)
    })


    db.User = require('../models/user')(sequelize, DataTypes);
    db.BusinessCategory = require('../models/business_category')(sequelize, DataTypes);
    db.Business = require('../models/business')(sequelize, DataTypes);
    db.InvestmentRequest = require('../models/investment_request')(sequelize, DataTypes);
    db.Investment = require('../models/investment')(sequelize, DataTypes);
    db.Contract = require('../models/contract')(sequelize, DataTypes);
    db.BusinessPerformance = require('../models/business_performance')(sequelize, DataTypes);
    db.BestPerformingBusiness = require('../models/best_performing_business')(sequelize, DataTypes);
    db.BestPerformingInvestor = require('../models/best_performing_investor')(sequelize, DataTypes);
    db.InvestmentOffer = require('../models/investment_offer')(sequelize, DataTypes);
    db.NewsBlog = require('../models/news_blog')(sequelize, DataTypes);


    // User associations
db.User.hasMany(db.InvestmentRequest, { foreignKey: 'user_id', as: 'investmentRequests' });
db.User.hasMany(db.Investment, { foreignKey: 'user_id', as: 'investments' });
db.User.hasMany(db.NewsBlog, { foreignKey: 'author_id', as: 'newsBlogs' });
db.User.hasMany(db.BestPerformingInvestor, { foreignKey: 'user_id', as: 'bestPerformingInvestors' });

// BusinessCategory associations
db.BusinessCategory.hasMany(db.Business, { foreignKey: 'category_id', as: 'businesses' });

// Business associations
db.Business.belongsTo(db.BusinessCategory, { foreignKey: 'category_id', as: 'category' });
db.Business.hasMany(db.Investment, { foreignKey: 'business_id', as: 'investments' });
db.Business.hasMany(db.BusinessPerformance, { foreignKey: 'business_id', as: 'performances' });
db.Business.hasOne(db.BestPerformingBusiness, { foreignKey: 'business_id', as: 'bestPerformance' });

// InvestmentRequest associations
db.InvestmentRequest.belongsTo(db.User, { foreignKey: 'user_id', as: 'requestingUser' });
db.InvestmentRequest.hasMany(db.InvestmentOffer, { foreignKey: 'request_id', as: 'investmentOffers' });

// Investment associations
db.Investment.belongsTo(db.User, { foreignKey: 'user_id', as: 'investingUser' });
db.Investment.belongsTo(db.Business, { foreignKey: 'business_id', as: 'business' });
db.Investment.hasOne(db.Contract, { foreignKey: 'investment_id', as: 'contract' });

// Contract associations
db.Contract.belongsTo(db.Investment, { foreignKey: 'investment_id', as: 'investment' });

// BusinessPerformance associations
db.BusinessPerformance.belongsTo(db.Business, { foreignKey: 'business_id', as: 'performanceBusiness' });

// BestPerformingBusiness associations
db.BestPerformingBusiness.belongsTo(db.Business, { foreignKey: 'business_id', as: 'bestBusiness' });

// BestPerformingInvestor associations
db.BestPerformingInvestor.belongsTo(db.User, { foreignKey: 'user_id', as: 'investingUser' });

// InvestmentOffer associations
db.InvestmentOffer.belongsTo(db.InvestmentRequest, { foreignKey: 'request_id', as: 'investmentRequest' });
db.InvestmentOffer.belongsTo(db.User, { foreignKey: 'investor_id', as: 'investor' });

// NewsBlog associations
db.NewsBlog.belongsTo(db.User, { foreignKey: 'author_id', as: 'author' });



module.exports = db