const express = require("express");
const router = express.Router();

const {
  addImage,
  removeImage,
  updateImage,
} = require("../controllers/upload.controller");

const { auth } = require("../middleware");
const { uploadImage } = require("../services/uploadImage");

router.post("/:id", auth, uploadImage("files"), addImage);
router.delete("/:id", auth, removeImage);
router.patch("/:id", auth, uploadImage("files"), updateImage);

module.exports = router;
