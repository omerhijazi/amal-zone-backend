'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'seller_transactions',
      [
        {
          id: 1,
          seller_id: 1, // Apex Electronics
          amount: 759.99,
          iban_destination: 'SA8010000001234567890123',
          reference: 'TRX-202610-0001',
          status: 'completed',
          initiated_at: now,
          completed_at: now,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          seller_id: 2, // Moda Trendz
          amount: 27.74,
          iban_destination: 'SA8020000009876543210987',
          reference: 'TRX-202610-0002',
          status: 'completed',
          initiated_at: now,
          completed_at: now,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('seller_transactions_id_seq', (SELECT GREATEST(MAX(id), 1) FROM seller_transactions));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'seller_transactions',
      {
        id: {
          [Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
