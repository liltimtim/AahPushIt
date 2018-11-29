const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption")
  .fieldEncryption;
const Schema = mongoose.Schema;
const SECRET_KEY = require("../config/keys").SECRET_KEY;
const AuthorizedApplicationsSchema = new Schema({
  name: {
    type: String,
    select: false,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  firebase_config_id: {
    type: Schema.Types.ObjectId,
    ref: "fs.files",
    select: false
  }
});

AuthorizedApplicationsSchema.plugin(mongooseFieldEncryption, {
  fields: ["firebase_config"],
  secret: SECRET_KEY
});

module.exports = Application = mongoose.model(
  "application",
  AuthorizedApplicationsSchema
);
