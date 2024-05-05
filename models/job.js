module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Job", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pay: {
      type: DataTypes.INTEGER,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });
};
