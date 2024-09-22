require('dotenv').config()

const express = require('express')
const cors=require('cors')



const setMiddlewares = require('./middlewares/middleware')
const setRoutes = require('./routes/routes')



const app = express()
// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://investment-dashboard-five.vercel.app']; // Add more origins as needed

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

require('./database/db')

setMiddlewares(app)
setRoutes(app)

app.listen(1000, () => {
    console.log('server create success on port')
})