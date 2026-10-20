'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'cart_items',
      [
        {
          id: 1,
          cart_id: 1, // Alice's cart
          product_sku_id: 4, // TSHIRT-WHT-M (29.99)
          quantity: 1,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          cart_id: 1, // Alice's cart
          product_sku_id: 6, // ESPRESSO-SG-PRO (219.99)
          quantity: 1,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('cart_items_id_seq', (SELECT GREATEST(MAX(id), 1) FROM cart_items));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'cart_items',
      {
        id: {
          [Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
