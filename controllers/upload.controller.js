const { images, product } = require("../models");
const fs = require("fs");

exports.addImage = async (req, res) => {
  const { id } = req.params;
  try {
    let data = req.files.map((item) => {
      const image = {};
      image.product_id = id;
      image.files = item.filename;
      return image;
    });

    await images.bulkCreate(data);

    res.send({
      status: "success",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.removeImage = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await images.findOne({ where: { id: id } });

    await fs.unlink(`public/images/${data.files}`, function (err) {
      if (err) {
        throw res.status(500).json({ message: "delete image failed!" });
      }
    });

    await images.destroy({ where: { id: id } });

    res.send({
      status: "success",
      message: `Delete product id: ${id} finished`,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateImage = async (req, res) => {
  const { id } = req.params;
  try {
    const dataSatu = await images.findOne({ where: { id: id } });
    await fs.unlink(`public/images/${dataSatu.files}`, function (err) {
      if (err) {
        throw res.status(500).json({ message: "delete image failed!" });
      }
    });

    let data = await req.files.map((item) => {
      const image = {};
      image.id = id;
      image.files = item.filename;
      image.product_id = req?.body?.product_id;
      return image;
    });

    await images.bulkCreate(data, {
      updateOnDuplicate: ["files", "product_id"],
    });

    const uploadData = await images.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const datas = JSON.parse(JSON.stringify(uploadData));

    res.send({
      status: "success",
      data: { image: process.env.PATH_FILE + datas.files },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
