'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Favorites extends Model {
    static associate(models) {
      Favorites.belongsTo(models.Users, { foreignKey: 'user_id' });
      Favorites.belongsTo(models.Stories, { foreignKey: 'story_id' });
    }
  }

  Favorites.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      story_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Favorites',
      tableName: 'favorites',
      timestamps: false
    }
  );

  return Favorites;
};
