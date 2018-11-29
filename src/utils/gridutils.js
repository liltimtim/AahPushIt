const mongoose = require("mongoose");
const SECRET_KEY = require("../config/keys").SECRET_KEY;
var crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  password = SECRET_KEY;

/**
 * encrypts a byte buffer
 * @param {Buffer} buffer
 */
const encrypt = buffer => {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return crypted;
};

const writeFile = req => {
  return new Promise((resolve, reject) => {
    if (req.file) {
      const { originalname, mimetype } = req.file;
      // req.file.buffer.pipe(encrypt)
      let buf = encrypt(req.file.buffer);
      let grid = require("gridfs")(mongoose.connection.db, mongoose.mongo);
      grid.writeFile(
        { filename: originalname },
        encrypt(req.file.buffer),
        (err, file) => {
          if (err) {
            return reject(err);
          }
          return resolve(file);
        }
      );
    } else {
      reject("File does not exist");
    }
  });
};
/**
 *
 * @param {Request} req
 */
const readFile = (fileId, res) => {
  return new Promise(async (resolve, reject) => {
    if (fileId) {
      try {
        let grid = require("gridfs")(mongoose.connection.db, mongoose.mongo);
        let exists = await grid.exist({ _id: fileId });

        if (exists) {
          /**
           * Decrypts a buffer / stream of data.
           */
          const decrypt = crypto.createDecipher(algorithm, password);
          let readStream = grid.createReadStream({ _id: fileId });
          readStream.pipe(decrypt).pipe(res);
          readStream.on("close", () => {
            return resolve();
          });
          readStream.on("error", err => {
            return reject(err);
          });
        } else {
          return reject(`cannot find configuration file with id ${fileId}`);
        }
      } catch (error) {
        return reject(error);
      }
    } else {
      return reject("No fileId given.");
    }
  });
};
/**
 * Use with caution, this is designed to read the whole file (json) into memory
 * like a configuration file
 * @param {*} fileId
 * @param {*} res
 */
const readWholeFile = fileId => {
  return new Promise(async (resolve, reject) => {
    if (fileId) {
      try {
        let grid = require("gridfs")(mongoose.connection.db, mongoose.mongo);
        let exists = await grid.exist({ _id: fileId });
        if (exists) {
          /**
           * Decrypts a buffer / stream of data.
           */
          const decrypt = crypto.createDecipher(algorithm, password);
          let readStream = grid.createReadStream({ _id: fileId });
          const p = readStream.pipe(decrypt);
          let buffers = [];
          p.on("error", err => {
            readStream.destroy();
            p.destroy();
            console.log(err);
            return reject(err);
          });
          p.on("data", data => {
            buffers.push(data);
          });
          p.on("end", () => {
            readStream.destroy();
            p.destroy();
            resolve(Buffer.concat(buffers));
          });
        } else {
          return reject(`cannot find configuration file with id ${fileId}`);
        }
      } catch (error) {
        return reject(error);
      }
    } else {
      return reject("No fileId given.");
    }
  });
};

const deleteFile = fileId => {
  return new Promise(async (resolve, reject) => {
    let grid = require("gridfs")(mongoose.connection.db, mongoose.mongo);
    let exists = await grid.exist({ _id: fileId });
    if (exists) {
      await grid.remove({ _id: fileId });
      return resolve();
    } else {
      return resolve();
    }
  });
};

const findOne = id => {
  return new Promise((resolve, reject) => {
    let Grid = require("gridfs-stream")(mongoose.connection.db, mongoose.mongo);
    let strId = String(id._id);
    Grid.findOne({ _id: String(id._id) }, (err, record) => {
      if (err) {
        return reject(err);
      }
      return resolve(record);
    });
  });
};

module.exports = {
  writeFile: writeFile,
  readFile: readFile,
  deleteFile: deleteFile,
  readWholeFile: readWholeFile
};
