const express = require("express");

const app = express();

app.get("/sum" , function(req,res){

    const a = req.query.a;
    const b = req.query.b;  

    res.json({
        answer: a+b
    })

});


app.get("/multiply" , function(req,res){

    const k = req.query.k;
    const m = req.query.m;  

    res.json({
        multiply : k*m
    })


});


// app.get("/divide" , function(req,res){

// });

app.listen(3000);