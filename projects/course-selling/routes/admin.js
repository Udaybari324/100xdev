const {Router} = require("express");
const {adminModel,courseModel} = require("../db");
const {adminMiddleware} = require("../middleware/admin");


const adminRouter = Router();


// Import the JWT Admin Password from the config file for verification
const { JWT_ADMIN_PASSWORD } = require("../config");

// Import necessary modules for handling JWT, password hashing, and schema validation
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const zod = require("zod");

adminRouter.post("/signup", async function(req, res){
         // using zod 
             const requirebody = zod.object({
                email: zod.string().email().min(5), // Email must be a valid email format with minimum 5 characters
                password: zod.string().min(5), // Password must be at least 5 characters long
                firstName: zod.string().min(3), // First name must be at least 3 characters long
                lastName: zod.string().min(3),
        
             });
        
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
        // Create a new admin with the given email, hashed password, firstName, and lastName

            try{
             await adminModel.create({
                email: email,
                password : hashedPassword,
                firstName, 
                lastName,
            })}
            catch(error){
                return res.status(400).json({
                    message:"you are already sign up",
                })
            }
        
        
            //send a 201 rerquest to client that sign up is succesfull
            res.json({
                    Message: "sign up succeesful",
         });
 });



adminRouter.post("/signin",async function(req, res) {
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
    const admin = await adminModel.findOne({
        email : email, // querying the user by email 
    })
      // If the user is not found, return a 403 error indicating incorrect credentials
      if(!admin){
        return res.status(403).json({
            message: "incorrect credential",
        })
      }

      //if email is ok then password match 
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if(passwordMatch){
        const token = jwt.sign( {id: admin_id} , JWT_ADMIN_PASSWORD);

        // send the gen token back to client 
        res.status(200).json({
            toaken : token,
        });
      }else{
        res.status(403).json({
            messsage: "invalid credential"
        })
    }  
})



    
adminRouter.post("/", function(req, res) {

        res.json({
            Message: "you are sign up and you  can change it "
        })
    })
// new course add ke liye put 
    adminRouter.put("/", function(req, res) {

        res.json({
            Message: "you are sign up"
        })
    })
    // sare course dikhene
    adminRouter.get("/bulk", function(req, res) {

        res.json({
            Message: "you are sign up"
        })
    })

module.exports= {
    adminRouter : adminRouter
}