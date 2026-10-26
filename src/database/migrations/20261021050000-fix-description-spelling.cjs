'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Fix 'describtion' -> 'description' in categories table
    await queryInterface.renameColumn('categories', 'describtion', 'description');

    // 2. Fix 'descrition' -> 'description' in sub_categories table
    await queryInterface.renameColumn('sub_categories', 'descrition', 'description');
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.renameColumn('categories', 'description', 'describtion');
    await queryInterface.renameColumn('sub_categories', 'description', 'descrition');
  },
};
