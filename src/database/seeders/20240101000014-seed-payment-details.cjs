'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'payment_details',
      [
        {
          id: 1,
          order_id: 1,
          amount: 829.98,
          provider: 'stripe',
          status: 'completed',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          order_id: 2,
          amount: 1299.99,
          provider: 'apple_pay',
          status: 'completed',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('payment_details_id_seq', (SELECT GREATEST(MAX(id), 1) FROM payment_details));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'payment_details',
      {
        id: {
          [Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
