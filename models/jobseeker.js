module.exports = (sequelize, DataTypes) => {
    return sequelize.define('JobSeeker', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      location: {
        type: DataTypes.STRING
      },
      occupation: {
        type: DataTypes.STRING
      },
      skills: {
        type: DataTypes.STRING
      },
      CV: {
        type: DataTypes.STRING
      }
    });
  };