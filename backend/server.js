require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routers/authRoutes.js');


const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
// app.post("/api/auth/register", (req, res) => {
//     console.log("registerUser action");
//     console.log("firstName: ", req.body.firstName);
//     console.log("lastName: ", req.body.lastName);
//     console.log("email: ", req.body.email);
//     res.send("registerUser action");
// });

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
        console.log(`Connected to MongoDB and listening on port ${port}`);
    });
}).catch(err => {
    console.log(err);
});
    


