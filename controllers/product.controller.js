const { product, category, user, images } = require("../models");
const { getPagination, getPagingData } = require("../services/pagination");

exports.addProduct = async (req, res) => {
  try {
    const data = { user_id: req.user.id, ...req.body };
    const newProduct = await product.create(data);
    const productData = await product.findOne({
      where: { id: newProduct.id },
      include: [
        {
          model: category,
          as: "product_category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: user,
          as: "product_user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: images,
          as: "product_image",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    const datas = JSON.parse(JSON.stringify(productData));

    res.status(200).send({
      status: "success",
      data: {
        ...datas,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProductUser = async (req, res) => {
  try {
    const productData = await product.findAll({
      where: { user_id: req.user.id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: category,
          as: "product_category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: user,
          as: "product_user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: images,
          as: "product_image",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    res.status(200).send({
      status: "success",
      data: [...productData],
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = await product.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: category,
          as: "product_category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: user,
          as: "product_user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: images,
          as: "product_image",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    if (productData.user_id != req.user.id) {
      res.status(401).send({
        status: "failed error",
        message: "Unauthorized data product",
      });
      return;
    }

    res.status(200).send({
      status: "success",
      productData,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = await product.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (productData.user_id != req.user.id) {
      res.status(401).send({
        status: "failed error",
        message: "Unauthorized data product",
      });
      return;
    }

    await product.update(req.body, { where: { id: id } });
    const data = await product.findOne({
      where: { id: id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: category,
          as: "product_category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: user,
          as: "product_user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: images,
          as: "product_image",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = await product.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (productData.user_id != req.user.id) {
      res.status(401).send({
        status: "failed error",
        message: "Unauthorized data product",
      });
      return;
    }

    await product.destroy({ where: { id: id } });

    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getAll = async (req, res) => {
  const { page, size } = req.query;
  try {
    const { limit, offset } = getPagination(page, size);
    let data = await product.findAndCountAll({
      where: { user_id: req.user.id },
      limit,
      offset,
      include: [
        {
          model: category,
          as: "product_category",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: user,
          as: "product_user",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: images,
          as: "product_image",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    data = JSON.parse(JSON.stringify(data));
    const response = getPagingData(data, page, limit);

    res.status(200).send({
      status: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
};
