const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please tell us your Name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your Email'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('user', userSchema);
