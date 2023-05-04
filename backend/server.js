require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routers/authRoutes.js');
const eventRoutes = require('./routers/eventRoutes.js');

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Connected to MongoDB and listening on port ${port}`);
    });
}).catch(err => {
    console.log(err);
});
    


