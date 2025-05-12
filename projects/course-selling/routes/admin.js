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
        
            };
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
            };
            //send a 201 rerquest to client that sign up is succesfull
            res.json({
                    Message: "sign up succeesful",
         });
 });




adminRouter.post("/signin", async function(req, res) {
        //define the scchema for validating the req body data using zod 
    const requirebody = zod.object({
        email: zod.string().email(), // email must be valid format 
        password: zod.string().min(8),
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
        const token = jwt.sign( {id: admin._id} , JWT_ADMIN_PASSWORD);

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



// Define the admin routes for updating a course
adminRouter.put("/course", adminMiddleware, async function (req, res) {
    // Get the adminId from the request object, set by the admin middleware
    const adminId = req.adminId;

    // Define a schema using zod to validate the request body for updating a course
    const requireBody = zod.object({
        courseId: zod.string().min(5), // Ensure course ID is at least 5 characters
        title: zod.string().min(3).optional(), // Title is optional
        description: zod.string().min(5).optional(), // Description is optional
        imageUrl: zod.string().url().min(5).optional(), // Image URL is optional
        price: zod.number().positive().optional(), // Price is optional
    });

    // Parse and validate the incoming request body against the schema
    const parseDataWithSuccess = requireBody.safeParse(req.body);

    // If validation fails, respond with an error message and the details of the error
    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Incorrect data format", // Inform the client about the error
            error: parseDataWithSuccess.error, // Provide specific validation error details
        });
    }

    // Destructure the validated fields from the request body
    const { courseId, title, description, imageUrl, price } = req.body;

    // Attempt to find the course in the database using the provided courseId and adminId
    const course = await courseModel.findOne({
        _id: courseId, // Match the course by ID
        creatorId: adminId, // Ensure the admin is the creator
    });

    // If the course is not found, respond with an error message
    if (!course) {
        return res.status(404).json({
            message: "Course not found!", // Inform the client that the specified course does not exist
        });
    }

    // Update the course details in the database using the updates object
    await courseModel.updateOne(
        {
            _id: courseId, // Match the course by ID
            creatorId: adminId, // Ensure the admin is the creator
        },
        { 
            title: title || course.title, // Update title if provided, otherwise keep the existing title
            description: description || course.description, // Update description if provided, otherwise keep the existing description
            imageUrl: imageUrl || course.imageUrl, // Update imageUrl if provided, otherwise keep the existing imageUrl
            price: price || course.price, // Update price if provided, otherwise keep the existing price
         } 
    );

    // Respond with a success message upon successful course update
    res.status(200).json({
        message: "Course updated!", // Confirm successful course update
    });
});



// Define the admin routes for deleting a course
adminRouter.delete("/course", adminMiddleware, async function (req, res) {
    // Get the adminId from the request object
    const adminId = req.adminId;

    // Validate the request body data using zod schema (courseId must be valid)
    const requireBody = zod.object({
        courseId: zod.string().min(5), // Course ID must be at least 5 characters
    });

    // Parse and validate the request body data
    const parseDataWithSuccess = requireBody.safeParse(req.body);

    // If the data format is incorrect, send an error message to the client
    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    // Get courseId from the request body
    const { courseId } = req.body;

    // Find the course with the given courseId and creatorId
    const course = await  courseModel.findOne({
        _id: courseId,
        creatorId: adminId,
    });

    // If the course is not found, send an error message to the client
    if (!course) {
        return res.status(404).json({
            message: "Course not found!",
        });
    }

    // Delete the course with the given courseId and creatorId
    await courseModel.deleteOne({
        _id: courseId,
        creatorId: adminId,
    });

    // Respond with a success message if the course is deleted successfully
    res.status(200).json({
        message: "Course deleted!",
    });
});


// Define the admin routes for getting all courses
adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
    // Get the adminId from the request object
    const adminId = req.adminId;

    // Find all courses with the given creatorId
    const courses = await courseModel.find({
        creatorId: adminId,
    });

    // Respond with the courses if they are found successfully
    res.status(200).json({
        courses: courses,
    });
});

// Export the adminRouter so that it can be used in other files
module.exports = {
    adminRouter: adminRouter,
};