const { product, category, user, images } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

exports.random = async (_, res) => {
  try {
    let data = await product.findAll({
      where: { sold: false },
      limit: 10,
      order: [sequelize.fn("RAND")],
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

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
};

exports.detail = async (req, res) => {
  id = req.params.id;
  try {
    let data = await product.findByPk(id, {
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

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
};

exports.search = async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const { title } = req.query;
  try {
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    let data = await product.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `6371 *
              acos(cos(radians(${lat})) * cos(radians(loc_latitude)) *
              cos(radians(${lng}) - radians(loc_longitude)) +
              sin(radians(${lat})) * sin(radians(loc_latitude)))`
            ),
            "distance",
          ],
        ],
      },
      where: { sold: false, ...condition },
      having: sequelize.where(sequelize.col("distance"), "<", 25),
      order: sequelize.col("distance"),
      limit: 10,
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

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
};
