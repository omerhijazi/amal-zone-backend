'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'order_items',
      [
        {
          id: 1,
          order_id: 1,
          product_id: 2, // Titan Smartphone 5G
          product_sku_id: 2, // TITAN-5G-BLK
          quantity: 1,
          price_at_purchase: 799.99,
          seller_id: 1, // Apex Electronics
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          order_id: 1,
          product_id: 3, // Cotton Crewneck
          product_sku_id: 4, // TSHIRT-WHT-M
          quantity: 1,
          price_at_purchase: 29.99,
          seller_id: 2, // Moda Trendz
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 3,
          order_id: 2,
          product_id: 1, // ProBook Ultra 15 Laptop
          product_sku_id: 1, // PROBOOK-SG-15
          quantity: 1,
          price_at_purchase: 1299.99,
          seller_id: 1, // Apex Electronics
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('order_items_id_seq', (SELECT GREATEST(MAX(id), 1) FROM order_items));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'order_items',
      {
        id: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
