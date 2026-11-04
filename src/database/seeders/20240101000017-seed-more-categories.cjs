'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'categories',
      [
        {
          id: 13,
          name: 'Beauty & Personal Care',
          description: 'Skincare, haircare, fragrances, makeup, and personal grooming essentials.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 14,
          name: 'Sports & Outdoors',
          description: 'Fitness equipment, athletic apparel, camping gear, and outdoor recreation products.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 15,
          name: 'Books & Stationery',
          description: 'Fiction, non-fiction, academic textbooks, notebooks, and office essentials.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 16,
          name: 'Toys, Kids & Baby',
          description: 'Baby care products, educational toys, strollers, nursery gear, and kids apparel.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 17,
          name: 'Health & Wellness',
          description: 'Vitamins, dietary supplements, first aid, medical monitors, and wellness gear.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 18,
          name: 'Automotive & Industrial',
          description: 'Car accessories, replacement parts, maintenance tools, and garage equipment.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 19,
          name: 'Pet Supplies',
          description: 'Pet food, treats, toys, beds, grooming tools, and care supplies for dogs, cats, and more.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 20,
          name: 'Groceries & Gourmet Food',
          description: 'Pantry staples, organic produce, packaged snacks, beverages, and gourmet specialties.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 21,
          name: 'Jewelry & Watches',
          description: 'Fine jewelry, fashion accessories, luxury watches, and premium gift collections.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 22,
          name: 'Garden & Outdoor Living',
          description: 'Patio furniture, gardening tools, seeds, planters, grills, and outdoor lighting.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 23,
          name: 'Office & Productivity',
          description: 'Office furniture, printing supplies, desk organizers, and business electronics.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 24,
          name: 'Arts, Crafts & Sewing',
          description: 'Painting supplies, knitting yarn, sewing kits, fabrics, and DIY crafting essentials.',
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
          [Op.in]: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        },
      },
      {}
    );
  },
};
