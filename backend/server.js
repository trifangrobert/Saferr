require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const app = express();


const port = process.env.PORT || 4000;

app.use((req, rest, next) => {
    console.log('Middleware');
    next();
})

app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.json({msg: "Hello World!"});
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
        console.log(`Connected to MongoDB and listening on port ${port}`);
    });
}).catch(err => {
    console.log(err);
});
    


