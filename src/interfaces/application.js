const Application = require("../models/AuthorizedApplications");
const gridutils = require("../utils/gridutils");
exports.get = async () => {
  try {
    return await Application.find();
  } catch (err) {
    throw err;
  }
};

exports.post = async body => {
  try {
    if (!body) {
      throw throwError("Body cannot be undefined or null");
    }
    let newApplicaton = new Application(body);
    return await newApplicaton.save();
  } catch (err) {
    throw err;
  }
};

exports.putConfig = async req => {
  try {
    const { id } = req.params;
    if (!id) {
      throw throwError("id cannot be undefined");
    }
    let application = await Application.findById(id).select(
      "firebase_config_id"
    );
    let file = await gridutils.writeFile(req);
    if (application.firebase_config_id) {
      // remove the current configuration
      await gridutils.deleteFile(application.firebase_config_id);
    }
    application.firebase_config_id = file._id;
    return await application.save();
  } catch (err) {
    throw err;
  }
};

exports.getConfig = async req => {
  try {
    const { id } = req.params;
    if (!id) {
      throw throwError("id cannot be undefined");
    }
    let application = await Application.findById(id).select(
      "firebase_config_id"
    );
    if (!application.firebase_config_id) {
      return null;
    }
    let f = await gridutils.readWholeFile(application.firebase_config_id);
    return JSON.parse(f.toString());
  } catch (err) {
    throw err;
  }
};

const throwError = msg => {
  let err = new Error();
  err.message = msg;
  return err;
};
