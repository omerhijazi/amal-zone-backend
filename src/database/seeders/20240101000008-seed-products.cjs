'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'products',
      [
        {
          id: 1,
          seller_id: 1, // Apex Electronics
          name: 'ProBook Ultra 15 Laptop',
          description: 'High performance laptop equipped with 16GB LPDDR5 RAM, 512GB NVMe SSD, 15.6-inch 4K IPS display, and Intel Core i7 processor.',
          summary: 'Powerful 15.6-inch laptop for creators and developers.',
          cover: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
          category_id: 11, // Laptops & Computers
          status: 'published',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          seller_id: 1, // Apex Electronics
          name: 'Titan Smartphone 5G',
          description: 'Next-generation flagship smartphone with 6.7-inch 120Hz Super AMOLED display, 256GB storage, and a triple 108MP camera array.',
          summary: 'Flagship 5G smartphone with ultra-sharp display and pro camera.',
          cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
          category_id: 10, // Smartphones & Accessories
          status: 'published',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 3,
          seller_id: 2, // Moda Trendz
          name: 'Classic Organic Cotton Crewneck',
          description: 'Crafted from 100% certified combed organic cotton. Features reinforced double stitching, ribbed collar, and pre-shrunk fabric.',
          summary: 'Ultra-soft everyday organic cotton crewneck tee.',
          cover: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
          category_id: 12, // Men Fashion
          status: 'published',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 4,
          seller_id: 2, // Moda Trendz
          name: 'Artisan Espresso Machine Barista Pro',
          description: 'Commercial-grade 15-bar Italian pressure pump with PID temperature control, dual thermoblock, and integrated steam wand.',
          summary: 'Compact cafe-grade espresso maker for authentic espresso and latte.',
          cover: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
          category_id: 14, // Coffee & Espresso
          status: 'published',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('products_id_seq', (SELECT GREATEST(MAX(id), 1) FROM products));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'products',
      {
        id: {
          [Op.in]: [1, 2, 3, 4],
        },
      },
      {}
    );
  },
};
