const { user } = require("../models");

exports.getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const data = await user.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt", "password", "id"] },
    });

    res.send({
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
