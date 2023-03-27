const express = require("express")
const app = express()
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload')


// to echange data between server and client using json
app.use(express.json());
//to store cookies
app.use(cookieParser());
// Body-parser parses is an HTTP request body that usually helps when you need to know more than just the URL being hit. Specifically in the context of a POST, PATCH, or PUT HTTP request where the information you want is contained in the body. Using body-parser allows you to access req.
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(fileUpload({useTempFiles:true}));

// Config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })
}

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;