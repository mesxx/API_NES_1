var express = require("express");
var router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const { isUserExist } = require("../middleware");

router.post("/register", isUserExist, register);
router.post("/login", login);

module.exports = router;
