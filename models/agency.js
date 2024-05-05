module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Agency", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    number: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    agencyDescription: {
      type: DataTypes.TEXT,
    },
  });
};
