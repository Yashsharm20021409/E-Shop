const express = require("express")
const app = express()
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");


// to echange data between server and client using json
app.use(express.json());
//to store cookies
app.use(cookieParser());

// to allow backend excepting data from globally bcoz we sent data from front end is at different port and backend is at different port
// if from this url we get any req our cookies get store that why we use this
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
);

// to upload avatar and to access the uploads folder globally
app.use("/",express.static("uploads"))
// Body-parser parses is an HTTP request body that usually helps when you need to know more than just the URL being hit. Specifically in the context of a POST, PATCH, or PUT HTTP request where the information you want is contained in the body. Using body-parser allows you to access req.
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));



// Config
if(process.env.NODE_ENV !== "PRODUCTION"){ 
    require("dotenv").config({
        path:"backend/config/.env"
    })
}


// Routes
const user = require("./controller/user")
const shop = require("./controller/shop");
const product = require("./controller/product");

app.use("/api/v2/user",user);
app.use("/api/v2/shop",shop);
app.use("/api/v2/product",product); 

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;