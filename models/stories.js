'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Stories extends Model {
    static associate(models) {
      Stories.belongsTo(models.Users, {
        foreignKey: 'created_by_user_id',
        as: 'creator'
      });

      Stories.hasMany(models.Chapters, { foreignKey: 'story_id' });
      Stories.hasMany(models.Reading_History, { foreignKey: 'story_id' });
      Stories.hasMany(models.Favorites, { foreignKey: 'story_id' });
      Stories.hasMany(models.Ratings, { foreignKey: 'story_id' });

      Stories.belongsToMany(models.Genres, {
        through: models.Story_Genres,
        foreignKey: 'story_id',
        otherKey: 'genre_id',
        as: 'genres'
      });
    }
  }

  Stories.init(
    {
      story_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cover_image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rating_average: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0
      },
      total_ratings: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      is_exclusive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Stories',
      tableName: 'stories',
      timestamps: false
    }
  );

  return Stories;
};
