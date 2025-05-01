const {Router} = require("express");

const courseRouter = Router()

    courseRouter.post("/purchase", function(req, res) {

        res.json({
            Message: "you are sign up"
        })
    })
    
    courseRouter.get("/preview", function(req, res) {
    
        res.json({
            Message: "course preview end point"
        })
    })

module.exports = {
    courseRouter: courseRouter

}
