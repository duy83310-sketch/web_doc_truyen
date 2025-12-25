'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Genres extends Model {
    static associate(models) {
      Genres.belongsToMany(models.Stories, {
        through: models.Story_Genres,
        foreignKey: 'genre_id',
        otherKey: 'story_id',
        as: 'stories'
      });
    }
  }

  Genres.init(
    {
      genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Genres',
      tableName: 'genres',
      timestamps: false
    }
  );

  return Genres;
};
