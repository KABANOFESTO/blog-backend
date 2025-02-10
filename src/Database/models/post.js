// models/post.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      Posts.belongsTo(models.Users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        as: "postedBy"
      });
      Posts.hasMany(models.Comments, {
        foreignKey: 'postId',
      });
      Posts.hasMany(models.Likes, {
        foreignKey: 'postId',
      });
      Posts.hasMany(models.unLikes, {
        foreignKey: 'postId',
      });
    }
  }

  Posts.init({
    postTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    postImage: DataTypes.STRING,
    postContent: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['FAITH & SPIRITUALITY', 'PERSONAL GROWTH & SELF DISCOVERY', 'KINDNESS & COMPASSION', 'VLOG']]
      }
    },
    userId: DataTypes.INTEGER,
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Posts',
  });

  return Posts;
};