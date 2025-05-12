const express = require('express');
const JWt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin")

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);




async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB");

    app.listen(process.env.PORT || 3000, () => {
        console.log(`listening on port ${process.env.PORT || 3000}`);
    });
}


main()
