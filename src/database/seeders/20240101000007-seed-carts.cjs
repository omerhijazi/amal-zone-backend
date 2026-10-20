'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'carts',
      [
        {
          id: 1,
          user_id: 13, // Alice
          total: 249.98,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          user_id: 14, // Bob
          total: 0.00,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('carts_id_seq', (SELECT GREATEST(MAX(id), 1) FROM carts));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'carts',
      {
        id: {
          [Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
