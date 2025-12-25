'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ratings', {
      rating_id: {
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

      score: {
        type: Sequelize.INTEGER
      },

      comment: {
        type: Sequelize.TEXT
      },

      rated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Ratings', ['user_id'], { name: 'idx_ratings_user' });
    await queryInterface.addIndex('Ratings', ['story_id'], { name: 'idx_ratings_story' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Ratings', 'idx_ratings_user');
    await queryInterface.removeIndex('Ratings', 'idx_ratings_story');
    await queryInterface.dropTable('Ratings');
  }
};
