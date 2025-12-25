'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Ratings extends Model {
    static associate(models) {
      Ratings.belongsTo(models.Users, { foreignKey: 'user_id' });
      Ratings.belongsTo(models.Stories, { foreignKey: 'story_id' });
    }
  }

  Ratings.init(
    {
      rating_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      story_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Ratings',
      tableName: 'ratings',
      timestamps: false
    }
  );

  return Ratings;
};
