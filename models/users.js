'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Stories, {
        foreignKey: 'created_by_user_id'
      });

      Users.hasMany(models.Reading_History, {
        foreignKey: 'user_id'
      });

      Users.hasMany(models.Favorites, {
        foreignKey: 'user_id'
      });

      Users.hasMany(models.Ratings, {
        foreignKey: 'user_id'
      });
    }
  }

  Users.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },

      phone_number: DataTypes.STRING,
      full_name: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      gender: DataTypes.STRING,
      avatar_url: DataTypes.STRING,

      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Users',
      tableName: 'users',
      timestamps: false
    }
  );

  return Users;
};
