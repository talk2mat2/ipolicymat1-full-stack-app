const util = require("util");
const multer = require("multer");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
process.env.NODE_ENV !== "production" ? require("dotenv").config() : null;
//var url = "mongodb://localhost:27017/martins";
const { v4: uuidv4 } = require("uuid");
//const url = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0-gussd.mongodb.net/ipmat1?retryWrites=true&w=majority`;
const url = process.env.DATABASE_URL

var storage = new GridFsStorage({
  url: url,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${uuidv4()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-${uuidv4()}-${file.originalname}`,
    };
  },
});
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(
//       null,
//       "./upload"
//       //  path.join(__dirname, "../public/image")
//     );
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,

//       file.fieldname + "-" + `${uuidv4()}` + path.extname(file.originalname)
//     );
//   },
// });
var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
