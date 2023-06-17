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
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
        usersThatUpvoted: {
            type: Array,
            default: [],
        },
        usersThatDownvoted: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
