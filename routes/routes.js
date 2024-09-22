const authRoute=require('./authRoute')
const businessRoute=require('./businessRoute')
const businessCategoryRoute=require('./businessCategoryRoute')
const investmentRoute=require('./investmentRoute')
const investmentRequestRoute=require('./investmentRequestRoute')
const investmentOfferRoute=require('./investmentOfferRoute')
const contractRoute=require('./contractsRoute')
const newsBlogRoute=require('./newsBlogRoute')
const bestPerformingInvestorRoute=require('./bestPerformingInvestorRoute')
const bestPerformingBusinessRoute=require('./bestPerformingBusinessRoute')
const businessPerformanceRoute=require('./businessPerformanceRoute')
const userRoute=require('./userRoute')

const routes = [
    {
        path:'/auth',
        handler:authRoute
    },
    {
        path:'/business',
        handler:businessRoute
    },
    {
        path:'/business-categories',
        handler:businessCategoryRoute
    },
    {
        path:'/investments',
        handler:investmentRoute
    },
    {
        path:'/investment-requests',
        handler:investmentRequestRoute
    },
    {
        path:'/investment-offers',
        handler:investmentOfferRoute
    },
    {
        path:'/contracts',
        handler:contractRoute
    },
    {
        path:'/news-blogs',
        handler:newsBlogRoute
    },
    {
        path:'/best-performing-investors',
        handler:bestPerformingInvestorRoute
    },
    {
        path:'/best-performing-businesses',
        handler:bestPerformingBusinessRoute
    },
    {
        path:'/business-performance',
        handler:businessPerformanceRoute
    },
    {
        path:'/users',
        handler:userRoute
    },
    {
        path: '/',
        handler: (req,res)=>{
            res.send({msg:'Welcome'})
        }
    },
   
]

module.exports = (app) => {
    routes.forEach(r => {
        if (r.path == '/') {
            app.use(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}