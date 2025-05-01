const { mongoose} = require("mongoose");
require('dotenv').config();
console.log("connected to");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema =new Schema({
    email: {type: String , unique:true},
    password: String,
    firstName : String,
    lastName : String
})

const adminSchema = new Schema({
    email: {type: String , unique:true},
    password: String,
    firstName : String,
    lastName : String 

})

const courseSchema = new Schema({
    tittle: String,
    description : String,
    price : Number,
    ImageURL : String,
    creatorId :ObjectId
})

const purchaseSchema = new Schema({
    userId : ObjectId,
    courseId : ObjectId

})

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports= {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}