'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Story_Genres extends Model {
    static associate(models) {
      Story_Genres.belongsTo(models.Stories, {
        foreignKey: 'story_id',
        as: 'story'
      });

      Story_Genres.belongsTo(models.Genres, {
        foreignKey: 'genre_id',
        as: 'genre'
      });
    }
  }

  Story_Genres.init(
    {
      story_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Story_Genres',
      tableName: 'story_genres',
      timestamps: false
    }
  );

  return Story_Genres;
};
