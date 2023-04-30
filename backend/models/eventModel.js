const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        typeOfCrime: {
            type: String,
            required: true,
            trim: true,
        },
        crimeDescription: {
            type: String,
            required: true,
            trim: true,
        },
        coordinate: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
            latitudeDelta: {  
                type: Number,
                // required: true,
            },
            longitudeDelta: {
                type: Number,
                // required: true,
            },
        },
        date: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);
//nice to have: upvotes

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
