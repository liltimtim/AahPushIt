const bcrypt = require("bcryptjs");
const guid = require("guid");
const Application = require("../models/AuthorizedApplications");
const gridutils = require("../utils/gridutils");
const config = require("../config/keys");
const Installation = require("../models/Installation");
const jwt = require("jsonwebtoken");
exports.get = async () => {
  try {
    return await Application.find();
  } catch (err) {
    throw err;
  }
};
/**
 * Retrieves all devices for the user
 */
exports.getDevices = async ({ user }) => {
  try {
    const { user_id } = user;
    return await Installation.find({ user_id });
  } catch (err) {
    throw err;
  }
};

const findOne = async id => {
  try {
    return await Application.findById(id);
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

/**
 * Allows devices to register with this particular application, will create and return
 * a device installation object
 */
exports.register = async req => {
  try {
    const { id } = req.params;
    // registration id could be fcm id or device token id
    const { user_id, device_type, registration_id } = req.body;
    let originalSecret = guid.raw();
    let hashed = await hashIt(originalSecret);
    let newInstall = new Installation({
      user_id,
      registration_id,
      device_type,
      client_secret: hashed,
      application_id: id
    });
    return { installation: await newInstall.save(), secret: originalSecret };
  } catch (err) {
    throw err;
  }
};

exports.authenticate = async req => {
  try {
    const { id } = req.params;
    const { client_secret, installation_id } = req.body;
    if (!id) {
      throw throwError("application id is required");
    }
    if (!client_secret) {
      throw throwError("client_secret is required");
    }
    if (!installation_id) {
      throw throwError("installation id is required");
    }
    // find the application by its id
    let install = await Installation.findById(installation_id).select(
      "client_secret"
    );
    // check client secret matches hash
    let matches = await hashMatchesSignature(
      install.client_secret,
      client_secret
    );
    if (!matches) {
      throw throwError("client secret does not match");
    }
    let token = await generateJWTToken({
      applicationId: id,
      installationId: install.id
    });
    return { token: `Bearer ${token}` };
  } catch (err) {
    throw err;
  }
};

exports.findOne = findOne;

const throwError = msg => {
  let err = new Error();
  err.message = msg;
  return err;
};

const hashIt = async item => {
  let salt = await bcrypt.genSalt(10);
  let pepper = await bcrypt.hash(item, salt);
  return pepper;
};

const hashMatchesSignature = async (hash, item) => {
  return await bcrypt.compare(item, hash);
};

const generateJWTToken = async payload => {
  return await jwt.sign(payload, config.SECRET_KEY, {
    expiresIn: 3600
  });
};
