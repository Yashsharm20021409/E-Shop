const express = require("express")
const path = require("path")
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs")
const jwt = require("jsonwebtoken")
const sendMail = require("../utilis/sendMail")
const sendToken = require("../utilis/jwtToken")
const sendShopToken = require("../utilis/shopToken");
const { isSeller } = require('../middleware/auth');
const Shop = require("../model/shop");


// create-shop
// create shop
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
    try {
        const { email } = req.body;
        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Error deleting file" });
                }
            });
            return next(new ErrorHandler("User already exists", 400));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };

        const activationToken = createActivationToken(seller);

        const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop",
                message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${seller.email} to activate your shop!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

// activate user
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { activation_token } = req.body;

            const newSeller = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );

            if (!newSeller) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;

            let seller = await Shop.findOne({ email });

            if (seller) {
                return next(new ErrorHandler("User already exists", 400));
            }

            seller = await Shop.create({
                name: name,
                email: email,
                avatar: avatar,
                password: password,
                zipCode: zipCode,
                address: address,
                phoneNumber: phoneNumber,
            });

            sendShopToken(seller, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// Login into shop
router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
    try {

        // fetch details from body
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please Provide All the fields!", 400));
        }

        // find user if exist of not
        const user = await Shop.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400));
        }

        //  check is password is correct or not
        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return next(
                new ErrorHandler("Please provide the correct information", 400)
            );
        }

        // if everything is fine then simply send the token to the user
        sendShopToken(user, 201, res);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));


// load shop
router.get(
    "/getSeller",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findById(req.seller._id);

            if (!seller) {
                return next(new ErrorHandler("User doesn't exists", 400));
            }

            res.status(200).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// logout the seller
router.get("/logout", catchAsyncErrors((req, res, next) => {
    try {
        // when we click on the logout button our cookies get null and we use window reload method in frontend(in logout section) due to user get logout
        res.cookie("seller_token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        res.status(201).json({
            success: true,
            message: "Log out successful!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

module.exports = router;