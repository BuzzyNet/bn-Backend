const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  location: {
    lat: { type: Number },
    long: { type: Number },
  },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  country: { type: String },
});

const profileSchema = new Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String },
    dob: { type: Date, required: true },
    address: {},
    profilePhoto: {
      url: { type: String },
      changeDate: { type: Date },
    },
    address: { type: addressSchema },
    socialMediaHandles: { type: [Object] },
  },
  { timestamps: true }
);

profileSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified(dob)) return next();
  const age = Math.abs(
    new Date(Date.now - user.dob.getTime()).getUTCFullYear - 1970
  );

  if (age > 13) return next();
  else return next(new Error("age is less than 13"));
});

var UserProfile = mongoose.model("UserProfile", profileSchema);

module.exports = UserProfile;
