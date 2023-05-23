const express = require("express")
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utilis/ErrorHandler")
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Shop = require("../model/shop");
const Order = require("../model/order");
const Product = require("../model/product");

// no need to use isAuthenticated because we have user in our body that means it is already authenticated
router.post("/create-order", catchAsyncErrors(async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    // group cart Items by ShopId (means group cart items belong to shop)
    // after this in database you see multiple item in same order who belongs to same shop insted of creating different order for each item belongs to same shop
    const shopItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shopId;

      // check if id not exists in map then create the entry otherwise push item
      if (!shopItemsMap.has(shopId)) {
        // set shopId(which is Unique for each shop) and empty array to store item
        shopItemsMap.set(shopId, []);
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

// get all orders of user
router.get("/get-all-orders/:userId", catchAsyncErrors(async (req, res, next) => {
  try {
    // finding order of user using user id
    // did like "user._id" because user is already a part or order (check in data base) we have to find all thing in structural way to avoid error on simply user._id gives error bcoz both user and _id are diff parameter
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})
);


// get all orders of seller
router.get("/get-seller-all-orders/:shopId", catchAsyncErrors(async (req, res, next) => {
  try {

    // "cart.shopId" => means shopId is present inside cart in Order object in Database and we have to make query in structured manner to get correct data without any failure as same we did on above route
    // closed in "" because cart and shopId both are diff parameters and we store id in it after fetching from params
    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})
);

// update order status for seller
router.put("/update-order-status/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    // find the order in db by id(fetch from params)
    const order = await Order.findById(req.params.id);

    // if order not exists then return error
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    // if status is this then execute updateOrder Function for each product or cart by sending product id and qty
    if (req.body.status === "Transferred to delivery partner") {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    // storing new status
    order.status = req.body.status;

    // if product delivered then update seller info and payment info and delliver date
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * .10;
      // we substract service charge because service charge is paid to company not to seller
      // exe this function
      await updateSellerInfo(order.totalPrice - serviceCharge);
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });

    // this function is used for dec the Quantity and inc the sold_out
    async function updateOrder(id, qty) {
      const product = await Product.findById(id);

      product.stock -= qty;
      product.sold_out += qty;

      await product.save({ validateBeforeSave: false });
    }

    // update seller info
    async function updateSellerInfo(amount) {
      const seller = await Shop.findById(req.seller.id);

      seller.availableBalance = amount;

      await seller.save();
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
})
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;