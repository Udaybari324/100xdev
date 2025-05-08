const { model } = require("mongoose")
const { Router} = require("express")
const {userModel, purchaseModel, courseModel} = require("../db");
const {usermiddleware} = require("../middleware/user")

const userRouter = Router();

// Import the JWT User Secret from the configuration file for signing JWT tokens
const { JWT_USER_PASSWORD } = require("../config");

// Import necessary modules for handling JWT, password hashing, and schema validation
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const zod = require("zod");


   userRouter.post("/signup", async function(req, res) {
     // using zod 
     const requirebody = zod.object({
        email: zod.string().email().min(5), // Email must be a valid email format with minimum 5 characters
        password: zod.string().min(5), // Password must be at least 5 characters long
        firstName: zod.string().min(3), // First name must be at least 3 characters long
        lastName: zod.string().min(3),

     })

    // Parse and validate the incoming request body data
    const parseDatawithSuccess = requirebody.safeParse(req.body)

    //if validation fails 
    if(!parseDatawithSuccess.success){
        return res.json({
            message: "incorrect data format",
            eorro : parseDatawithSuccess.error, // it provides details about the validation error
        });

    }



  // extract validated email pass, ,,,, 
    const { email, password , firstName , lastName } = req.body;  

    // hash the user passsword with bycrypt with salt rounds 10 
    const  hashedPassword = await bcrypt.hash(password, 10);

// try creating a new user in database with hashed password 
    try{
     await userModel.create({
        email: email,
        password : hashedPassword,
        firstName, 
        lastName,
    })}
    catch(error){
        return res.status(400).json({
            message:"you are already sign up"
        })
    }


    //send a 201 rerquest to client that sign up is succesfull
    res.json({
            Message: "sign up succeesful",
        });
    });



// define a post route for user sign in 

   userRouter.post("/signin", async function(req, res,){
    //define the scchema for validating the req body data using zod 
    const requirebody = zod.object({
        email: zod.string().email(), // email must be valid format 
        password: zod.string().mid(8),
    });

    const parseDatawithSuccess = requirebody.safeParse(req.body);

    // validation of pasrsed data 
    if(!parseDatawithSuccess.success){
        res.json({
            message: "incorrect data  format",
            error: parseDatawithSuccess.error,
        });
    }

    const {email , password} = req.body;

    // Attempt to find the user with the provided email in the database
    const user = await userModel.findOne({
        email : email, // querying the user by email 
    })
      // If the user is not found, return a 403 error indicating incorrect credentials
      if(!user){
        return res.status(403).json({
            message: "incorrect credential",
        })
      }

      //if email is ok then password match 
      const passwordMatch = await bcrypt.compare(password, user.password);

      if(passwordMatch){
        const token = jwt.sign( {id: user_id} , JWT_USER_PASSWORD);

        // send the gen token back to client 
        res.status(200).json({
            toaken : token,
        });
      }else{
        res.status(403).json({
            messsage: "invalid credential"
        })
    }

});


   userRouter.get("/purchases", userMiddleware =async function(req ,res){
    // get the user id from the reqest object send by the user middleware 
    const userId = req.userId;

    
    // Find all purchase records associated with the authenticated userId
    const purchases = await purchaseModel.find({
        userId : userId,
    })

    // check for what purchases
    if(!purchases){
        return res.status(404).json({
            message : " no purchase found",
        })
    }

 //If purchases are found, extract the courseIds from the found purchases
 const purchasesCourseId =  purchases.map((purchase) => purchase.courseID);

 
 // Find all course details associated with the courseIds
 const coursesData = await courseModel.find({
    _id : {$in : purchasesCourseId}, // Querying courses using the extracted course IDs
 })

     // Send the purchases and corresponding course details back to the client
        res.status(200).json({
              purchases,
              coursesData,
        });     
    });

module.exports={
    userRouter: userRouter
};