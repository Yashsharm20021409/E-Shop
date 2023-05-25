const Shop = require("../model/shop");
const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
// const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request ---only for seller
router.post("/create-withdraw-request", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const { amount } = req.body;

        const data = {
            seller: req.seller,
            amount,
        }

        const withdraw = await Withdraw.create(data);

        res.status(201).json({
            success: true,
            withdraw,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

module.exports = router;