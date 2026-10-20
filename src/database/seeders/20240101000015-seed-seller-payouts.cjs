'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'seller_payouts',
      [
        {
          id: 1,
          seller_id: 1, // Apex Electronics (5% commission)
          order_item_id: 1, // Titan 5G (799.99)
          total_amount: 799.99,
          commission_amount: 40.00,
          seller_earning: 759.99,
          status: 'completed',
          paid_at: now,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          seller_id: 2, // Moda Trendz (7.5% commission)
          order_item_id: 2, // Cotton Crewneck (29.99)
          total_amount: 29.99,
          commission_amount: 2.25,
          seller_earning: 27.74,
          status: 'completed',
          paid_at: now,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 3,
          seller_id: 1, // Apex Electronics (5% commission)
          order_item_id: 3, // ProBook Ultra 15 (1299.99)
          total_amount: 1299.99,
          commission_amount: 65.00,
          seller_earning: 1234.99,
          status: 'pending',
          paid_at: null,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('seller_payouts_id_seq', (SELECT GREATEST(MAX(id), 1) FROM seller_payouts));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'seller_payouts',
      {
        id: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
