const {Router} = require("express");
const {adminModel} = require("../db")

const adminRouter = Router();

    adminRouter.post("/signup", function(req, res) {

        res.json({
            Message: "you are sign up"
        })
    })

    adminRouter.post("/signin", function(req, res) {

        res.json({
            Message: "you are sign up"
        })
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