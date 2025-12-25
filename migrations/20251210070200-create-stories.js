'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stories', {
      story_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      author: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cover_image_url: {
        type: Sequelize.STRING(255)
      },
      summary: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING(20)
      },
      created_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      rating_average: {
        type: Sequelize.DECIMAL(3,2),
        allowNull: false,
        defaultValue: 0.00
      },
      total_ratings: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      view_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_exclusive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Optional index for queries by creator
    await queryInterface.addIndex('Stories', ['created_by_user_id'], { name: 'idx_stories_created_by' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Stories', 'idx_stories_created_by');
    await queryInterface.dropTable('Stories');
  }
};
