const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// create schema for user document
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["citizen", "police"],
      default: "citizen",
    },
    coordinate: {
      latitude: {
          type: Number,
          default: 0,
          required: true,
      },
      longitude: {
          type: Number,
          default: 0,
          required: true,
      },
      latitudeDelta: {  
          type: Number,
          default: 0,
          // required: true,
      },
      longitudeDelta: {
          type: Number,
          default: 0,
          // required: true,
      },
  },
  },
  { timestamps: true }
);

// hash password before saving to db for security
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
