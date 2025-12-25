'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Chapters extends Model {
    static associate(models) {
      Chapters.belongsTo(models.Stories, { foreignKey: 'story_id' });
      Chapters.hasMany(models.Reading_History, { foreignKey: 'last_chapter_read_id' });
    }
  }

  Chapters.init(
    {
      chapter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      story_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      chapter_number: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT('long'),
      published_at: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Chapters',
      tableName: 'chapters',   // 🔧 dùng đúng tên bảng trong MySQL
      timestamps: false        // ⭐ FIX LỖI createdAt / updatedAt
    }
  );

  return Chapters;
};
