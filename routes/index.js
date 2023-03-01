var express = require("express");
var router = express.Router();

const auth = require("./auth");
const profile = require("./profile");
const product = require("./product");
const image = require("./upload");
const ads = require("./ads");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/auth", auth);
router.use("/profile", profile);
router.use("/product", product);
router.use("/image", image);
router.use("/ads", ads);

module.exports = router;
