'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'product_attributes',
      [
        {
          id: 1,
          product_attribute_type: 'size',
          value: 'S',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          product_attribute_type: 'size',
          value: 'M',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 3,
          product_attribute_type: 'size',
          value: 'L',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 4,
          product_attribute_type: 'size',
          value: 'XL',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 5,
          product_attribute_type: 'color',
          value: 'Midnight Black',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 6,
          product_attribute_type: 'color',
          value: 'Space Gray',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 7,
          product_attribute_type: 'color',
          value: 'Ocean Blue',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 8,
          product_attribute_type: 'color',
          value: 'Pure White',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('product_attributes_id_seq', (SELECT GREATEST(MAX(id), 1) FROM product_attributes));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'product_attributes',
      {
        id: {
          [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      },
      {}
    );
  },
};
