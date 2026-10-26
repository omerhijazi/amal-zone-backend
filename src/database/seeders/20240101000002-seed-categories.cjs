'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'categories',
      [
        {
          id: 10,
          name: 'Electronics & Devices',
          description: 'Smartphones, laptops, smart home gear and audio accessories.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 11,
          name: 'Fashion & Apparel',
          description: 'Men and women trendy clothing, footwear, and designer collections.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 12,
          name: 'Home & Kitchen',
          description: 'Cookware, appliances, coffee equipment, and modern home decor.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('categories_id_seq', (SELECT GREATEST(MAX(id), 1) FROM categories));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'categories',
      {
        id: {
          [Op.in]: [10, 11, 12],
        },
      },
      {}
    );
  },
};
