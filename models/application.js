module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Application', {
        applicationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
          },
          statusOfApplication: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending'
          }
    });
  };
