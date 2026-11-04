'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'sub_categories',
      [
        // Electronics & Devices (parent_id: 10)
        {
          id: 15,
          parent_id: 10,
          name: 'Audio & Headphones',
          description: 'Wireless earbuds, noise-canceling headphones, and bluetooth speakers.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 16,
          parent_id: 10,
          name: 'Cameras & Photography',
          description: 'DSLRs, mirrorless cameras, lenses, and photography accessories.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 17,
          parent_id: 10,
          name: 'Smart Home & Security',
          description: 'Smart speakers, security cameras, smart locks, and automation devices.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Fashion & Apparel (parent_id: 11)
        {
          id: 18,
          parent_id: 11,
          name: 'Footwear & Shoes',
          description: 'Running sneakers, formal shoes, boots, and casual footwear.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 19,
          parent_id: 11,
          name: 'Bags & Luggage',
          description: 'Travel suitcases, everyday backpacks, crossbody bags, and duffels.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Home & Kitchen (parent_id: 12)
        {
          id: 20,
          parent_id: 12,
          name: 'Kitchen Appliances',
          description: 'Air fryers, blenders, food processors, and microwave ovens.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 21,
          parent_id: 12,
          name: 'Bedding & Bath',
          description: 'Comforters, luxury bed sheets, memory foam pillows, and plush towels.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 22,
          parent_id: 12,
          name: 'Furniture & Home Decor',
          description: 'Modern coffee tables, ergonomic accent chairs, lamps, and wall art.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Beauty & Personal Care (parent_id: 13)
        {
          id: 23,
          parent_id: 13,
          name: 'Skincare',
          description: 'Facial cleansers, serums, sunscreens, and anti-aging moisturizers.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 24,
          parent_id: 13,
          name: 'Hair Care & Styling',
          description: 'Shampoos, conditioners, hair treatments, curling irons, and dryers.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 25,
          parent_id: 13,
          name: 'Fragrances & Perfumes',
          description: 'Luxury perfumes, eau de toilette, colognes, and fragrance gift sets.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Sports & Outdoors (parent_id: 14)
        {
          id: 26,
          parent_id: 14,
          name: 'Exercise & Fitness',
          description: 'Dumbbells, resistance bands, yoga mats, and cardio machines.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 27,
          parent_id: 14,
          name: 'Camping & Hiking',
          description: 'Tents, hiking backpacks, sleeping bags, and outdoor camp cooking gear.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 28,
          parent_id: 14,
          name: 'Cycling & Accessories',
          description: 'Road & mountain bikes, protective helmets, lights, and bike locks.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Books & Stationery (parent_id: 15)
        {
          id: 29,
          parent_id: 15,
          name: 'Fiction & Literature',
          description: 'Bestselling novels, thrillers, fantasy, sci-fi, and literary classics.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 30,
          parent_id: 15,
          name: 'Self-Help & Business',
          description: 'Personal growth, productivity, entrepreneurship, and financial guidance.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 31,
          parent_id: 15,
          name: 'Notebooks & Writing',
          description: 'Bullet journals, spiral notebooks, fountain pens, and desk stationery.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Toys, Kids & Baby (parent_id: 16)
        {
          id: 32,
          parent_id: 16,
          name: 'Baby Care & Nursery',
          description: 'Diapers, organic baby wipes, baby monitors, and feeding essentials.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 33,
          parent_id: 16,
          name: 'Toys & Board Games',
          description: 'Building blocks, family board games, STEM toys, and plush dolls.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Health & Wellness (parent_id: 17)
        {
          id: 34,
          parent_id: 17,
          name: 'Vitamins & Supplements',
          description: 'Daily multivitamins, protein powders, fish oils, and mineral boosters.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 35,
          parent_id: 17,
          name: 'Medical & First Aid',
          description: 'Digital thermometers, blood pressure cuffs, bandages, and first aid kits.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Automotive & Industrial (parent_id: 18)
        {
          id: 36,
          parent_id: 18,
          name: 'Car Electronics',
          description: 'HD dash cams, Bluetooth transmitters, battery jump starters, and GPS.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 37,
          parent_id: 18,
          name: 'Car Care & Detailing',
          description: 'Car wax, tire shine, interior detailing sprays, and microfiber towels.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Pet Supplies (parent_id: 19)
        {
          id: 38,
          parent_id: 19,
          name: 'Dog Supplies',
          description: 'Premium dog kibble, natural chews, harnesses, leashes, and dog beds.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 39,
          parent_id: 19,
          name: 'Cat Supplies',
          description: 'Wet & dry cat food, scratchers, self-cleaning litter boxes, and toys.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Groceries & Gourmet Food (parent_id: 20)
        {
          id: 40,
          parent_id: 20,
          name: 'Coffee & Specialty Tea',
          description: 'Single-origin coffee beans, matcha powder, herbal teas, and syrups.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 41,
          parent_id: 20,
          name: 'Snacks & Pantry Staples',
          description: 'Organic nuts, dried fruits, olive oils, artisanal pastas, and healthy bars.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Jewelry & Watches (parent_id: 21)
        {
          id: 42,
          parent_id: 21,
          name: 'Watches',
          description: 'Automatic timepieces, chronograph sports watches, and minimal quartz watches.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 43,
          parent_id: 21,
          name: 'Fine Jewelry',
          description: 'Pendants, stud earrings, tennis bracelets, and sterling silver rings.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Garden & Outdoor Living (parent_id: 22)
        {
          id: 44,
          parent_id: 22,
          name: 'Gardening & Planters',
          description: 'Gardening toolsets, watering cans, ceramic planters, and potting soil.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 45,
          parent_id: 22,
          name: 'Grills & Outdoor Heating',
          description: 'Charcoal and gas BBQs, smoker accessories, and patio heaters.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Office & Productivity (parent_id: 23)
        {
          id: 46,
          parent_id: 23,
          name: 'Office Furniture & Ergonomics',
          description: 'Adjustable standing desks, mesh task chairs, and dual monitor arms.',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },

        // Arts, Crafts & Sewing (parent_id: 24)
        {
          id: 47,
          parent_id: 24,
          name: 'Painting & Art Supplies',
          description: 'Acrylic paint sets, stretched canvases, watercolor palettes, and brush sets.',
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
    const ids = Array.from({ length: 33 }, (_, i) => i + 15); // IDs 15 to 47

    await queryInterface.bulkDelete(
      'sub_categories',
      {
        id: {
          [Op.in]: ids,
        },
      },
      {}
    );
  },
};
