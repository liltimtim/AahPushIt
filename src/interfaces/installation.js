const Installation = require("../models/Installation");
const Application = require("../models/AuthorizedApplications");
/**
 * Retrieves all installations by query
 */
exports.getByQuery = async query => {
  try {
    return await Installation.find(query);
  } catch (err) {
    return throwError(err, res);
  }
};

/**
 * Allows device to register to receive push notifications. Allows creation of installation object.
 */
exports.create = async req => {
  try {
    // verify an application exists
    const { body } = req;
    const { application_id } = body;
    let application = await Application.findById(application_id);
    if (!application) {
      throw throwError(`Application with id ${application_id} does not exist`);
    }
    let newInstall = new Installation(body);
    return await newInstall.save();
  } catch (err) {
    throw err;
  }
};

exports.delete = async id => {
  try {
    return await Installation.findByIdAndDelete(id);
  } catch (err) {
    throw err;
  }
};

const throwError = msg => {
  let err = new Error();
  err.message = msg;
  return err;
};
