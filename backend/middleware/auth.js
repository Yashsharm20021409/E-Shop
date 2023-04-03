const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

// check user is login is yes then call next(to load the user)
exports.isAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    // fetch token of user from cookies
    const {token} = req.cookies;

    // if token not exist means either user is not loged in or user is not created yet
    if(!token){
        return next(new ErrorHandler("Please Login to Continue",401));
    }

    // decode the token
    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decode.id);

    // true return next(means load user now)
    next();
})

exports.isSeller = catchAsyncErrors(async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

    req.seller = await Shop.findById(decoded.id);

    next();
});