const express = require("express")
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utilis/ErrorHandler")
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Shop = require("../model/shop");
const Order = require("../model/order");
const Product = require("../model/product");

// no need to use isAuthenticated because we have user in our body that means it is already authenticated
router.post("/create-order",catchAsyncErrors(async(req,res,next)=>{
    try {
        const {cart , shippingAddress,user,totalPrice,paymentInfo} = req.body;

        // group cart Items by ShopId (means group cart items belong to shop)
        // after this in database you see multiple item in same order who belongs to same shop insted of creating different order for each item belongs to same shop
        const shopItemsMap = new Map();

        for(const item of cart){
            const shopId = item.shopId;

            // check if id not exists in map then create the entry otherwise push item
            if(!shopItemsMap.has(shopId)){
                // set shopId(which is Unique for each shop) and empty array to store item
                shopItemsMap.set(shopId,[]);
            }
            shopItemsMap.get(shopId).push(item);
        }

        // Now Create an order for each shop
        const orders = []

        for (const [shopId, items] of shopItemsMap) {
            // creating order indexWise(shopId)
            const order = await Order.create({
              cart: items,
              shippingAddress,
              user,
              totalPrice,
              paymentInfo,
            });
            orders.push(order);
          }
    
          res.status(201).json({
            success: true,
            orders,
          });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

module.exports = router;