const Shop = require("../model/shop");
const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utilis/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
router.post(
    "/create-withdraw-request",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { amount } = req.body;

            const data = {
                seller: req.seller,
                amount,
            };

            try {
                await sendMail({
                    email: req.seller.email,
                    subject: "Withdraw Request",
                    message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ from your seller account on E-Shop. has been processed. It will take 3days to 7days to processing! Thankyou Team Shop.`,
                });
                // res.status(201).json({
                //     success: true,
                // });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }


            const shop = await Shop.findById(req.seller._id);
            shop.availableBalance = shop.availableBalance - amount;
            data.seller.availableBalance = shop.availableBalance;
            const withdraw = await Withdraw.create(data);

            await shop.save();

            res.status(201).json({
                success: true,
                withdraw,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// get all withdraws --- admnin
router.get(
    "/get-all-withdraw-request",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const withdraws = await Withdraw.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                withdraws,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update withdraw request ---- admin
router.put(
    "/update-withdraw-request/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { sellerId } = req.body;

            // send id or withdraw for find then update the status and update time
            const withdraw = await Withdraw.findByIdAndUpdate(
                req.params.id,{status: "succeed",updatedAt: Date.now(),},
                { new: true }
            );

            // find seller
            const seller = await Shop.findById(sellerId);

            // create object of transaction
            const transection = {
                _id: withdraw._id,
                amount: withdraw.amount,
                updatedAt: withdraw.updatedAt,
                status: withdraw.status,
            };

            // update seller transaction object
            seller.transections = [...seller.transections, transection];

            // save seller info
            await seller.save();

            // send mail to the seller
            try {
                await sendMail({
                    email: seller.email,
                    subject: "Payment confirmation",
                    message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ has been confirmed please check your Bank Account. Amount Credited to your account 3 to 7 days Thankyou Team E-Shop.`,
                });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }
            res.status(201).json({
                success: true,
                withdraw,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;