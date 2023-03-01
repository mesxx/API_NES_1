"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.belongsTo(models.category, {
        as: "product_category",
        foreignKey: {
          name: "category_id",
        },
      });

      product.belongsTo(models.user, {
        as: "product_user",
        foreignKey: {
          name: "user_id",
        },
      });

      product.hasMany(models.images, {
        as: "product_image",
        foreignKey: {
          name: "product_id",
        },
      });
    }
  }
  product.init(
    {
      user_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      brand: DataTypes.STRING,
      model: DataTypes.STRING,
      year: DataTypes.STRING,
      condition: DataTypes.BOOLEAN,
      price: DataTypes.DOUBLE,
      description: DataTypes.TEXT,
      address: DataTypes.TEXT,
      loc_latitude: DataTypes.STRING,
      loc_longitude: DataTypes.STRING,
      sold: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
