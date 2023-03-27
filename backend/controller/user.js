const express = require("express")
const User = require("../model/user")
const path = require("path")
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs")
const jwt =  require("jsonwebtoken")
const sendMail = require("../utilis/sendMail")


// Create-User (register)
router.post("/create-user", upload.single("file"), async (req, res, next) => {

    try {
        const { name, email, password } = req.body;
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            // first file get upload in folder
            // then we find name of file and stored in filename
            // then we find the path of the file
            // then using fs module we delete that file
            
            // to avoid reupload vo avatar if user already exists to fix this bug
            const filename = req.file.filename;
            // rename the file
            const filepath = `uploads/${filename}`

            // delete the new upcoming file
            fs.unlink(filepath,(err)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({message:"Error deleting file"})
                }
            })
            return next(new ErrorHandler("User Already Exists", 400))
        }

        // if not exist

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl
        };

        const activationToken = createActivationToken(user);
        // make post req
        const activationUrl = `http://localhost:3000/activation/${activationToken}`

        try{
            await sendMail({
                email:user.email,
                subject:"Activate Your E-Shop Account",
                message:`Hello ${user.name}, Please Click on the below Link To Activate Your account : ${activationUrl}`
            })

            // Above function(send mail) is run parllely and this response we sent to front end and message shown on frontend
            res.send(201).json({
                success:true,
                message: "Please Check Your Email to verify your Account",
            });
        }
        catch(error){
            return next(new ErrorHandler(error.message,500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// create Activation Token 
const createActivationToken = (user)=>{
    return jwt.sign(user,process.env.ACTIVATION_SEC,{
        expiresIn:"5m"
    })
}

// activate user 

router.post("activation")


module.exports = router;