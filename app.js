"use strict";

const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const errorHandler = require('./middlewares/errorHandler')
const mainRouter = require('./routes/identity')
const sequelize = require('./config/db')



app.use(cors({origin:'*'}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/identify', mainRouter)
app.use(errorHandler)


sequelize.sync({force:false}).then(() => {
  console.log('Tables synced successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});


app.listen(PORT, () => {
    try {
        console.log(`SERVER RUNNING ON PORT ${PORT}`)
    } catch (error) {
        console.log(`ERROR WHILE STARTING SERVER ${error}`)
    }
})
