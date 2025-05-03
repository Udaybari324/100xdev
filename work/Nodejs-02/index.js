const  express = require("express");
const jwt = require('jsonwebtoken')
const JWT_SECRET = "ilovebibi"
const app = express();
app.use(express.json());

const users = [] ; // we are storing it in locastorage  not on mongodb etc .. 


// return random long string 
    // function generateToken() {
    //     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 
    //                 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    //                  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    //     let token = "";
    //     for (let i = 0; i < 32; i++) {
    //         // use a simple function here
    //         token += options[Math.floor(Math.random() * options.length)];
    //     }
    //     return token;
    // }

    // using jwt 

app.post("/signup",function(req, res){

    const username = req.body.username;
    const password = req.body.password;

    // if(username.length < 5){
    //     req.json({
    //         Message: "your username is very smal"
    //     })
    // }
  // input validation  learn later 
    users.push({
        username: username,
        password: password
    })

    
    res.json({
        Message: "you are signed in"
    })

})

app.post("/signin", function(req, res){

    const username = req.body.username;
    const password = req.body.password;

    const founduser = users.find(function(u){

        if(u.username == username){
            return true;
        }
        else{
            return false;
        }
    })

    if(founduser){

        const token = jwt.sign({
            username: username
        }, JWT_SECRET); // convert their username over to a jwt 


        founduser.token = token;
        res.json({
            Message: token
        })
    }
    else{
        res.status(403).send({
            Message: "Invalid username password"
        })

    }    
})


app.get("/me" , function(req ,res){
    const token = req.header.token
    const decodedinformation = jwt.verify(token, JWT_SECRET);

    const username = decodedinformation.username

    let founduser =null;

    for(let i=0 ; i<users.length(); i++){
        if(user[i].token ==token){
            founduser = user[i]
        }
    }
    if(founduser){
        res.json({
            username: founduser.username,
            password: founduser.password
        })
    }else{
        res.json({
            Message: "token invalid "
        })
    }


})



app.listen(3000);
