const Messages = require("../model/messages");
const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const path = require("path");
const { upload } = require("../multer");
const router = express.Router();

//create new messages
router.post("/create-new-message", upload.single("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const messageData = req.body;

        // creating url for image
        if (req.file) {
            const filename = req.file.filename;
            const fileUrl = path.join(filename);
            messageData.images = fileUrl;
        }

        // store data in messageData object
        messageData.conversationId = req.body.conversationId;
        messageData.sender = req.body.sender;
        messageData.text = req.body.text;

        // creating new message
        const message = new Messages({
            conversationId: messageData.conversationId,
            text: messageData.text,
            sender: messageData.sender,
            images: messageData.images ? messageData.images : undefined,
        });

        // save
        await message.save();

        // response to frontend
        res.status(201).json({
            success: true,
            message,
        });

    } catch (error) {
        return next(new ErrorHandler(error.message), 500);
    }
}))

// get all messages with conversation id
router.get(
    "/get-all-messages/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const messages = await Messages.find({
                conversationId: req.params.id,
            });

            res.status(201).json({
                success: true,
                messages,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message), 500);
        }
    })
);

module.exports = router;