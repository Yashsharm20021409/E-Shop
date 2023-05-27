const express = require("express")
const app = express()
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// to echange data between server and client using json
app.use(express.json());
//to store cookies
app.use(cookieParser());

// to allow backend excepting data from globally bcoz we sent data from front end is at different port and backend is at different port
// if from this url we get any req our cookies get store that why we use this
app.use(
    cors({
        origin: 'https://e-shop-87bh.vercel.app',
        credentials: true,
    })
);

// to upload avatar and to access the uploads folder globally
app.use("/", express.static(path.join(__dirname, "./uploads")));
app.use("/test", (req, res) => {
    res.send("Hello world!");
});
// Body-parser parses is an HTTP request body that usually helps when you need to know more than just the URL being hit. Specifically in the context of a POST, PATCH, or PUT HTTP request where the information you want is contained in the body. Using body-parser allows you to access req.
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));



// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    })
}


// Routes
const user = require("./controller/user")
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation")
const message = require("./controller/message")
const withdraw = require("./controller/withdraw")

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/withdraw", withdraw);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;