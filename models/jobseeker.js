module.exports = (sequelize, DataTypes) => {
    return sequelize.define('JobSeeker', {    
      name: {
        type: DataTypes.STRING,
        allowNull: false
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
      cv: {
        type: DataTypes.STRING
      }
    });
  };