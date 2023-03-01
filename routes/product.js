const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProductUser,
  getProductId,
  updateProduct,
  deleteProduct,
  getAll,
} = require("../controllers/product.controller");

const { auth } = require("../middleware");

router.post("/add-product", auth, addProduct);
router.patch("/update-product/:id", auth, updateProduct);
router.delete("/delete-product/:id", auth, deleteProduct);

router.get("/product-user", auth, getProductUser);
router.get("/:id", auth, getProductId);
router.get("/all/product", auth, getAll);

module.exports = router;
