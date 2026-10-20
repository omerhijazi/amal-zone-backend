'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'wishlists',
      [
        {
          id: 1,
          user_id: 13, // Alice
          product_id: 1, // ProBook Ultra 15
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          user_id: 13, // Alice
          product_id: 4, // Espresso Machine
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 3,
          user_id: 14, // Bob
          product_id: 2, // Titan Smartphone 5G
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('wishlists_id_seq', (SELECT GREATEST(MAX(id), 1) FROM wishlists));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'wishlists',
      {
        id: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
