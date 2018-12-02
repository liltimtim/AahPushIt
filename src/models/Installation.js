/**
 * Installation object holds the following properties
 * 1. User ID (some way to identify and query for the user)
 * 2. Registration ID (this can be the token from the device)
 * 3. Device Type (ios | android)
 * 4. ApplicationID (the id of the application that this device should register with)
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InstallationSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  // most likely the firebase fcm id
  registration_id: {
    type: String,
    required: true
  },
  device_type: {
    type: String,
    required: true,
    enum: ["ios", "android"]
  },
  application_id: {
    type: Schema.Types.ObjectId,
    ref: "application",
    required: true
  },
  // value will be how the client authenticates themselves
  // once created, this value will be hashed and become non-retrievable
  // if the installation client secret is lost, a new installation
  // will need to be created.
  client_secret: {
    type: String,
    required: true,
    select: false
  }
});

module.exports = Installation = mongoose.model(
  "installation",
  InstallationSchema
);
