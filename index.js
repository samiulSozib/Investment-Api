require('dotenv').config()

const express = require('express')
const cors=require('cors')



const setMiddlewares = require('./middlewares/middleware')
const setRoutes = require('./routes/routes')



const app = express()
app.use(cors());


require('./database/db')

setMiddlewares(app)
setRoutes(app)

app.listen(3000, () => {
    console.log('server create success on port')
})