'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Story_Genres', {
      story_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Stories',
          key: 'story_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Genres',
          key: 'genre_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.addIndex('Story_Genres', ['story_id'], { name: 'idx_story_genres_story' });
    await queryInterface.addIndex('Story_Genres', ['genre_id'], { name: 'idx_story_genres_genre' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Story_Genres', 'idx_story_genres_story');
    await queryInterface.removeIndex('Story_Genres', 'idx_story_genres_genre');
    await queryInterface.dropTable('Story_Genres');
  }
};
