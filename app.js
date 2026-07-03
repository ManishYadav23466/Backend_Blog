// require("dotenv").config();

// const express=require('express');
// const routers=require("./route/routes")
// const cors=require("cors");
// const db=require("./config/db")
// const cookieParser = require('cookie-parser');

// const app = express();

// const port=process.env.PORT || 3000;

// app.use(cookieParser());

// app.use(express.json());
// app.use(express.urlencoded({extended:true}))
// db();
// app.use(cors({
//     origin: ["http://localhost:5173","https://p3c87dgd-5173.inc1.devtunnels.ms"],
//     credentials: true 
// }));

// app.use("/",routers);



// app.listen(port,()=>{
//     console.log("server is running on localhost:",port);
// });

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

const db = require("./config/db");
const routers = require("./route/routes");

const { initSocket } = require("./socket/socket");

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

db();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://p3c87dgd-5173.inc1.devtunnels.ms",
    ],
    credentials: true,
  })
);

app.use("/", routers);

initSocket(server);

server.listen(port, () => {
  console.log("Server Running :", port);
});