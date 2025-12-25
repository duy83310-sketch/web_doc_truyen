'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chapters', {
      chapter_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      chapter_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('long') // longtext equivalent
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Chapters', ['story_id'], { name: 'idx_chapters_story' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Chapters', 'idx_chapters_story');
    await queryInterface.dropTable('Chapters');
  }
};
