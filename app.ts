"use strict";

import express,{Request,Response} from 'express';
import cors from 'cors';
const deoteenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
import errorHandler from './middlewares/errorHandler';
import mainRouter from './routes/identity';
import sequelize from './config/db';


const app = express()


app.use(cors({origin:'*'}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/identify', mainRouter)
app.use('/health', (req:Request,res:Response)=>res.status(200).json({message:'Server is running'}))

app.use(errorHandler)


sequelize.sync({force:false}).then(() => {
  console.log('Tables synced successfully!');
}).catch((error:any) => {
  console.error('Unable to create table : ', error);
});


app.listen(PORT, () => {
    try {
        console.log(`SERVER RUNNING ON PORT ${PORT}`)
    } catch (error) {
        console.log(`ERROR WHILE STARTING SERVER ${error}`)
    }
})
