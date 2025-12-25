'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
      favorite_id: {
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
      added_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('Favorites', ['user_id'], { name: 'idx_favorites_user' });
    await queryInterface.addIndex('Favorites', ['story_id'], { name: 'idx_favorites_story' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Favorites', 'idx_favorites_user');
    await queryInterface.removeIndex('Favorites', 'idx_favorites_story');
    await queryInterface.dropTable('Favorites');
  }
};
