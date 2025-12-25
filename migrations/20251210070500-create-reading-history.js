'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reading_History', {
      history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      story_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Stories',
          key: 'story_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      last_chapter_read_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Chapters',
          key: 'chapter_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      last_read_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Reading_History', ['user_id'], { name: 'idx_reading_history_user' });
    await queryInterface.addIndex('Reading_History', ['story_id'], { name: 'idx_reading_history_story' });
    await queryInterface.addIndex('Reading_History', ['last_chapter_read_id'], { name: 'idx_reading_history_chapter' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Reading_History', 'idx_reading_history_user');
    await queryInterface.removeIndex('Reading_History', 'idx_reading_history_story');
    await queryInterface.removeIndex('Reading_History', 'idx_reading_history_chapter');
    await queryInterface.dropTable('Reading_History');
  }
};
