require("dotenv").config();

const express=require('express');
const routers=require("./route/routes")
const cors=require("cors");
const db=require("./config/db")
const cookieParser = require('cookie-parser');

const app = express();

const port=process.env.PORT || 3000;

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true}))
db();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));

app.use("/",routers);



app.listen(port,()=>{
    console.log("server is running on localhost:",port);
});