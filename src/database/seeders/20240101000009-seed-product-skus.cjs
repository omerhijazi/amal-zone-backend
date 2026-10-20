'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'product_skus',
      [
        {
          id: 1,
          product_id: 1, // ProBook Ultra 15
          size_attribute_id: 3, // L (15-inch)
          color_attribute_id: 6, // Space Gray
          sku: 'PROBOOK-SG-15',
          price: 1299.99,
          quantity: 25,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          product_id: 2, // Titan Smartphone 5G
          size_attribute_id: 2, // M (Standard)
          color_attribute_id: 5, // Midnight Black
          sku: 'TITAN-5G-BLK',
          price: 799.99,
          quantity: 40,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 3,
          product_id: 2, // Titan Smartphone 5G
          size_attribute_id: 2, // M (Standard)
          color_attribute_id: 7, // Ocean Blue
          sku: 'TITAN-5G-BLU',
          price: 799.99,
          quantity: 30,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 4,
          product_id: 3, // Cotton Crewneck
          size_attribute_id: 2, // M
          color_attribute_id: 8, // Pure White
          sku: 'TSHIRT-WHT-M',
          price: 29.99,
          quantity: 100,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 5,
          product_id: 3, // Cotton Crewneck
          size_attribute_id: 3, // L
          color_attribute_id: 5, // Midnight Black
          sku: 'TSHIRT-BLK-L',
          price: 29.99,
          quantity: 80,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 6,
          product_id: 4, // Artisan Espresso Machine
          size_attribute_id: 2, // M (Standard)
          color_attribute_id: 6, // Space Gray
          sku: 'ESPRESSO-SG-PRO',
          price: 219.99,
          quantity: 15,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('product_skus_id_seq', (SELECT GREATEST(MAX(id), 1) FROM product_skus));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'product_skus',
      {
        id: {
          [Op.in]: [1, 2, 3, 4, 5, 6],
        },
      },
      {}
    );
  },
};
