'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {

    static associate(models) {
  
    }
  }
  Messages.init({
    names: DataTypes.STRING,
    email: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
 
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return Messages;
};