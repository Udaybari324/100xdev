const {Router} = require("express");

const courseRouter = Router();

const { purchaseModel , courseModel } = require("../db");

const {userMiddleware } = require("../middleware/user");

courseRouter.post("/purchase", async function(req, res) {
 // Extract userId and courseId from the request object, which was set by the userMiddleware and courseId sent by client 
    const userId = req.userId;
    const courseId = req.body.courseId;


 
    // If courseId is not provided in the request body, return a 400 error response to the client
    if (!courseId) {
        return res.status(400).json({
            message: "Please provide a courseId", // Error message sent back to the client
        });
    }

    // Check if the user has already purchased the course by querying the purchaseModel with courseId and userId
    const existingPurchase = await purchaseModel.findOne({
        courseId: courseId,
        userId: userId,
    });

    if (existingPurchase) {
        return res.status(400).json({
            message: "You have already bought this course",
        });
    }


    
    // Try to create a new purchase entry in the database with the provided courseId and userId
    await purchaseModel.create({
        courseId: courseId, // The ID of the course being purchased
        userId: userId,     // The ID of the user making the purchase
    });


     // If the purchase is successful, return a 201 status with a success message to the client
     res.status(201).json({
        message: "You have successfully bought the course", // Success message after purchase
    });

});


    // Define a GET route for previewing course details without authentication
    courseRouter.get("/preview", async function(req, res) {

        
    // Query the database to get all the courses available for purchase
    const courses = await courseModel.find({});


    
        res.status(200).json({
            courses : courses, //Send the course details back to the client
        });
    })

module.exports = {
    courseRouter: courseRouter

}
