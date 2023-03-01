const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

exports.register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(10).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ error: { status: "failed" } });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await user.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.APP_KEY, {
      expiresIn: 86400, //24
    });
    res.status(200).send({
      status: "success",
      data: {
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  try {
    const userData = await user.findOne({
      where: { email: req.body.email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    const isValid = await bcrypt.compare(req.body.password, userData.password);
    if (!isValid) {
      return res
        .status(400)
        .send({ status: "failed", message: "credential is invalid" });
    }

    const token = jwt.sign({ id: userData.id }, process.env.APP_KEY, {
      expiresIn: 86400, //24
    });

    res.status(200).send({
      status: "success",
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
