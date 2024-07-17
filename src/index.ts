require('dotenv').config();
import express from "express";
import http from 'http';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors';
import connectDB from "./config/db";
import router from "./router";
const app = express();
const port = process.env.PORT || 8000;

//connect to MongoDB server
connectDB();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


const server = http.createServer(app);
server.listen(port , ()=>{
    console.log('Server listening on http://localhost:8080/');
    
})

app.use('/',router());