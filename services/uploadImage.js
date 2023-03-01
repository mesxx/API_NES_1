const multer = require("multer");

exports.uploadImage = (imageFile) => {
  // Diskstorage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images"); //file storage location
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename filename by date now + original filename
    },
  });

  const imageFilter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }
    cb(null, true);
  };

  const sizeInMB = 5;
  const maxSize = sizeInMB * 1000 * 1000; // Maximum file size in MB

  const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: maxSize,
    },
  }).array(imageFile, 5);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 5 MB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
