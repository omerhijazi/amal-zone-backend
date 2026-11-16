'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_items', 'status', {
      type: Sequelize.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('order_items', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_order_items_status";');
  }
};
