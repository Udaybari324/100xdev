const { model } = require("mongoose")
const { Router} = require("express")

const userRouter = Router();

   userRouter.post("/signup", function(req, res) {

        res.json({
            Message: "you are sign up"
        })
    })
   userRouter.post("/signin", function(req, res) {
    
        res.json({
            Message: "you are sign up"
        })
    })
   userRouter.get("/purchases", function(req, res) {
    
        res.json({
            Message: "you are sign up"
        })
    })    

module.exports={
    userRouter: userRouter
}