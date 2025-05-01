const express = require('express');
const bcrypt = require('bcrypt');
const { UserModel , TodoModel} = require("./Db");
const jwt = require("jsonwebtoken")
// const JWT_SECRET = "udaybari@123"
const app = express();
app.use(express.json());
const  {z} = require('zod')
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://uday17:5fFgTuMuCMMnNU0J@cluster0.xayehpv.mongodb.net/todo-app-database")

const { auth ,JWT_SECRET } = require("./auth");






app.post('/signup', async function(req, res) {

// input validation using zod 

    const requiredBody = z.object({
        email : z.string().min(3).max(100).email(),
        password : z.string().min(3).max(100),
        name : z.string().min(3).max(100)

    })

    const parsedatawithsuccess = requiredBody.safeParse(req.body);

    if(!parsedatawithsuccess.success){
        res.json({
            Message: "incorrect format",
            error : parsedatawithsuccess.error
        })
        return 
    }


    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if(!email.isString() || !email.contains("@")){
        res.json({

            Message: "Incorrect email "

        })
        return 
    }

    let errorThrown =  false;

    try{
        const hashedPassword = await  bcrypt.hash(password , 5); // number of time it hashed to  more secure 
        console.log(hashedPassword);
        
        await UserModel.create({
            email: email,
            password: hashedPassword,
            name: name
        })
     }catch(e) {
        res.json({
            Message: "user alredy exist"
        })
        errorThrown = true;
    }

    if(!errorThrown){
        res.json({
            Message: "you are signed up"
        })
    }
});


app.post('/signin', async function(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    
    const user = await UserModel.findOne({
        email: email,
       
    })

    if(!user){
        res.json({
            Message: "user not exist in DB "
        })
        return 
    }

    // bcrypt provids fun  bcrypt.compare for comparing the  hashed password

    const passMatch= await bcrypt.compare(password , user.password);


    if(passMatch){
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET);
        res.json({
            token: token
        })
    }
    else{
        res.status(403).json({
            Message: "wrong crendentials"
        })
    }

}); // these 2 are non authenticated 


app.post('/todo', auth, async function(req, res) {

    const userId =req.userId;
    const tittle =  req.body.tittle;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        tittle,
        done,
    });

    res.json({
        Message: "todo created"
    })

});


app.get('/todos', auth , async function(req, res) {

    const userId = req.userId;

    const todos = await TodoModel.find({
        userId,
    });

    res.json({
        todos,
    });
});




app.listen(3000)