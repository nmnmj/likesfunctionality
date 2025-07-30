import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/connectDB.js'
import web from './routes/web.js'

const app = express()
const PORT = process.env.PORT || 8001

app.use(cors())
app.use(express.json())
connectDB(process.env.DATABASE_URL)
console.log("trag 2"

app.use("/",web)

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`)
})
