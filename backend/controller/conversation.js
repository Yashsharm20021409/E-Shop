const Conversation = require("../model/conversation");
const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();


//create new conversation
router.post("/create-new-conversation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { groupTitle, userId, sellerId } = req.body;
        const conversationExists = await Conversation.findOne({ groupTitle });

        if (conversationExists) {
            const conversation = conversationExists;
            res.status(201).json({
                success: true,
                conversation,
            });
        }
        else {
            const conversation = await Conversation.create({
                members: [userId, sellerId],
                groupTitle: groupTitle,
            });

            res.status(201).json({
                success: true,
                conversation,
            })
        }

    } catch (error) {
        return next(new ErrorHandler(error.response.message), 500);
    }
}))

// get seller conversations
router.get(
    "/get-all-conversation-seller/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            // findind convo of seller
            const conversations = await Conversation.find({
                members: {
                    // filtering seller id from two id present in db
                    $in: [req.params.id],
                },
                // after filtering sort the messages according to new updated
            }).sort({ updatedAt: -1, createdAt: -1 });

            res.status(201).json({
                success: true,
                conversations,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);


// get user conversations
// same as above only id got changed
router.get(
    "/get-all-conversation-user/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                members: {
                    $in: [req.params.id],
                },
            }).sort({ updatedAt: -1, createdAt: -1 });

            res.status(201).json({
                success: true,
                conversations,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);


// update the last message
router.put(
    "/update-last-message/:id",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { lastMessage, lastMessageId } = req.body;
  
        const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
          lastMessage,
          lastMessageId,
        });
  
        res.status(201).json({
          success: true,
          conversation,
        });
      } catch (error) {
        return next(new ErrorHandler(error), 500);
      }
    })
  );
module.exports = router;