const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = mongoose.ObjectId;


const User = new Schema({
    email:{type: string , unique: true},
    password: String,
    name: String
})

const todo =  new Schema({
    tittle: String,
    done: Boolean,
    userId: ObjectId

})

const UserModel = mongoose.model('users',User);
const TodoModel = mongoose.model('todos',todo);

module.exports = {

    UserModel: UserModel,
    TodoModel: TodoModel


}


