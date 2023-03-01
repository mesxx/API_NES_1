const express = require("express");
const router = express.Router();

const { getUser } = require("../controllers/profile.controller");
const { auth } = require("../middleware");

router.get("/", auth, getUser);

module.exports = router;
