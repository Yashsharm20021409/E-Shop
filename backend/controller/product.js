const express = require("express")
const router = express.Router();
const Product = require("../model/product");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utilis/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");


// create Product
router.post("/create-product", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return next(new ErrorHandler("Shop Id is Invalid", 400));
        }
        else {

            // req files of images becoz there are multiple images so we receving array from frontend
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);

            const productData = req.body;
            productData.images = imageUrls;
            productData.shop = shop;

            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product,
            });
        }
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}))

//get all products
router.get("/get-all-shop-products/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id });

        res.status(201).json({
            success: true,
            products
        });

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

// delete product of a shop
router.delete(
    "/delete-shop-product/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;

            const productData = await Product.findById(productId);

            // to delete from local storage
            productData.images.forEach((imageUrl) => {
                const filename = imageUrl;
                const filePath = `uploads/${filename}`;

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });

            // to delete from database
            const product = await Product.findByIdAndDelete(productId);

            if (!product) {
                return next(new ErrorHandler("Product not found with this id!", 500));
            }

            res.status(201).json({
                success: true,
                message: "Product Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all products
router.get(
    "/get-all-products",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);


module.exports = router;