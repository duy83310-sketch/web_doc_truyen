'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Reading_History extends Model {
    static associate(models) {
      Reading_History.belongsTo(models.Users, { foreignKey: 'user_id' });
      Reading_History.belongsTo(models.Stories, { foreignKey: 'story_id' });
      Reading_History.belongsTo(models.Chapters, {
        foreignKey: 'last_chapter_read_id'
      });
    }
  }

  Reading_History.init(
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
      last_chapter_read_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      last_read_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Reading_History',
      tableName: 'reading_history',
      timestamps: false
    }
  );

  return Reading_History;
};
