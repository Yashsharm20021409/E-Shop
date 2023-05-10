const express = require("express")
const User = require("../model/user")
const path = require("path")
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utilis/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs")
const jwt = require("jsonwebtoken")
const sendMail = require("../utilis/sendMail")
const sendToken = require("../utilis/jwtToken")
const { isAuthenticated } = require('../middleware/auth');


// Create-User (register)
// router.post("/create-user", upload.single("file"), async (req, res, next) => {

//     try {
//         const { name, email, password } = req.body;
//         const userEmail = await User.findOne({ email });

//         if (userEmail) {
//             // first file get upload in folder
//             // then we find name of file and stored in filename
//             // then we find the path of the file
//             // then using fs module we delete that file

//             // to avoid reupload vo avatar if user already exists to fix this bug
//             const filename = req.file.filename;
//             // rename the file
//             const filepath = `uploads/${filename}`

//             // delete the new upcoming file
//             fs.unlink(filepath,(err)=>{
//                 if(err){
//                     console.log(err);
//                     res.status(500).json({message:"Error deleting file"})
//                 }
//             })
//             return next(new ErrorHandler("User Already Exists", 400))
//         }

//         // if not exist

//         const filename = req.file.filename;
//         const fileUrl = path.join(filename);

//         const user = {
//             name: name,
//             email: email,
//             password: password,
//             avatar: fileUrl
//         };

//         const activationToken = createActivationToken(user);
//         // make url for sending mail
//         const activationUrl = `http://localhost:3000/activation/${activationToken}`;

//         try{
//             await sendMail({
//                 email:user.email,
//                 subject:"Activate Your E-Shop Account",
//                 message:`Hello ${user.name}, Please Click on the below Link To Activate Your account : ${activationUrl}`
//             })

//             // Above function(send mail) is run parllely and this response we sent to front end and message shown on frontend
//             res.status(201).json({
//                 success:true,
//                 message:`Please Check Your Email:- ${user.email} to verify your Account`,
//             });
//         }
//         catch(error){
//             return next(new ErrorHandler(error.message,500));
//         }
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// });




// create Activation Token 
// const createActivationToken = (user)=>{
//     return jwt.sign(user,process.env.ACTIVATION_SEC,{
//         expiresIn:"5m"
//     })
// }

// // activate user (when user click on url send on user mail to check user token is correct or not) 

// // this req occurs when user click on the link which is send from server to user mail
// // After successfully running this req user get stored in the data base otherwise not get stored
// router.post("/activation",catchAsyncErrors(async (req,res,next)=>{

//     try{
//         // fetch activation token
//         const {activation_token} = req.body

//         // verify activation token
//         const newUser = jwt.verify(activation_token,process.env.ACTIVATION_SEC);

//         // if token is not valid
//         if(!newUser){
//             return next(new ErrorHandler("Invalid Token",400));
//         }

//         // if valid 
//         const {name,email,password,avatar} = newUser

//         // if user already exist then also send error
//         let user = await User.findOne({email});

//         if(user){
//             return next(new ErrorHandler("User already exists", 400));
//         }

//         // if everything is fine then store the user into the db
//         user = await User.create({
//             name,
//             email,
//             password,
//             avatar
//         });
//         // const newUser1 = await user2.save();

//         // sendToken to user
//         sendToken(user,201,res);
//     }
//     catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// }));

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userEmail = await User.findOne({ email });

        if (userEmail) {
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

        const user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl,
        };

        const activation_token = createActivationToken(user);

        const activationUrl = `http://localhost:3000/activation/${activation_token}`;

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

// activate user
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { activation_token } = req.body;

            const newUser = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );

            if (!newUser) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const { name, email, password, avatar } = newUser;

            let user = await User.findOne({ email });

            if (user) {
                return next(new ErrorHandler("User already exists", 400));
            }
            user = await User.create({
                name: name,
                email: email,
                password: password,
                avatar: avatar
            });

            sendToken(user, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);



// Login user (password for all user for test yash123)
router.post("/login-user", catchAsyncErrors(async (req, res, next) => {
    try {

        // fetch details from body
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please Provide All the fields!", 400));
        }

        // find user if exist of not
        const user = await User.findOne({ email }).select("+password");

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
        sendToken(user, 201, res);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// Load user (means we refresh the page then user remian login)
router.get("/getuser", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        // fetch the user
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler("User doesn't exists", 400))
        }

        // if all good send success true and the user
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))


// logout the user
router.get("/logout", catchAsyncErrors((req, res, next) => {
    try {
        // when we click on the logout button our cookies get null and we use window reload method in frontend(in logout section) due to user get logout
        res.cookie("token", null, {
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

// update user info
router.put(
    "/update-user-info",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password, phoneNumber, name } = req.body;

            const user = await User.findOne({ email }).select("+password");

            if (!user) {
                return next(new ErrorHandler("User not found", 400));
            }

            // user have to provide password to update the info and we compare it here with the pass avilable ins mongodb
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return next(
                    new ErrorHandler("Please provide the correct information", 400)
                );
            }

            user.name = name;
            user.email = email;
            user.phoneNumber = phoneNumber;

            await user.save();

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update user avatar
router.put(
    "/update-avatar",
    isAuthenticated,
    upload.single("image"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            // chech user exists or not
            const existsUser = await User.findById(req.user.id);

            // check is path exists
            const existAvatarPath = `uploads/${existsUser.avatar}`;

            // delete file from local server
            fs.unlinkSync(existAvatarPath);

            // req new file from front end upload by user
            const fileUrl = path.join(req.file.filename);

            // update in existing file from new file in data base
            const user = await User.findByIdAndUpdate(req.user.id, {
                avatar: fileUrl,
            });

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update user addresses
router.put(
    "/update-user-addresses",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            const sameTypeAddress = user.addresses.find(
                (address) => address.addressType === req.body.addressType
            );
            if (sameTypeAddress) {
                return next(
                    new ErrorHandler(`${req.body.addressType} address already exists`)
                );
            }

            const existsAddress = user.addresses.find(
                (address) => address._id === req.body._id
            );

            if (existsAddress) {
                Object.assign(existsAddress, req.body);
            } else {
                // add the new address to the array
                user.addresses.push(req.body);
            }

            await user.save();

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete user address
router.delete(
    "/delete-user-address/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const userId = req.user._id;
            const addressId = req.params.id;

            console.log(addressId);

            await User.updateOne(
                {
                    _id: userId,
                },
                { $pull: { addresses: { _id: addressId } } }
            );

            const user = await User.findById(userId);

            res.status(200).json({ success: true, user });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update user password
router.put(
    "/update-user-password",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select("+password");

            const isPasswordMatched = await user.comparePassword(
                req.body.oldPassword
            );

            if (!isPasswordMatched) {
                return next(new ErrorHandler("Old password is incorrect!", 400));
            }

            if (req.body.newPassword !== req.body.confirmPassword) {
                return next(
                    new ErrorHandler("Password doesn't matched with each other!", 400)
                );
            }
            user.password = req.body.newPassword;

            await user.save();

            res.status(200).json({
                success: true,
                message: "Password updated successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;