'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'order_details',
      [
        {
          id: 1,
          user_id: 13, // Alice
          payment_id: 'PAY-ORD-001',
          total: 829.98,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          user_id: 14, // Bob
          payment_id: 'PAY-ORD-002',
          total: 1299.99,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('order_details_id_seq', (SELECT GREATEST(MAX(id), 1) FROM order_details));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'order_details',
      {
        id: {
          [Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
