const express = require("express");
const router = express.Router();

const { random, detail, search } = require("../controllers/ads.controller");
const { auth } = require("../middleware");

router.get("/random", auth, random);
router.get("/:id", auth, detail);
router.get("/set/search", auth, search);

module.exports = router;
