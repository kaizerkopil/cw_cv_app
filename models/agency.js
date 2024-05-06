module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Agency", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phonenum: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });
};
