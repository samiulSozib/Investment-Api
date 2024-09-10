const authRoute=require('./authRoute')
const businessRoute=require('./businessRoute')
const businessCategoryRoute=require('./businessCategoryRoute')
const investmentRoute=require('./investmentRoute')
const investmentRequestRoute=require('./investmentRequestRoute')

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