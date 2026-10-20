'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'sub_categories',
      [
        {
          id: 10,
          parent_id: 10, // Electronics & Devices
          name: 'Smartphones & Accessories',
          descrition: 'Latest iOS and Android devices, screen guards, and wireless chargers.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 11,
          parent_id: 10, // Electronics & Devices
          name: 'Laptops & Computers',
          descrition: 'Ultraportable notebooks, high-end workstations, and accessories.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 12,
          parent_id: 11, // Fashion & Apparel
          name: 'Men Fashion',
          descrition: 'Polos, casual t-shirts, jackets, chinos, and formal wear.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 13,
          parent_id: 11, // Fashion & Apparel
          name: 'Women Fashion',
          descrition: 'Contemporary dresses, activewear, cardigans, and handbags.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 14,
          parent_id: 12, // Home & Kitchen
          name: 'Coffee & Espresso',
          descrition: 'Espresso machines, pour-over drippers, grinders, and beans.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('sub_categories_id_seq', (SELECT GREATEST(MAX(id), 1) FROM sub_categories));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'sub_categories',
      {
        id: {
          [Op.in]: [10, 11, 12, 13, 14],
        },
      },
      {}
    );
  },
};
