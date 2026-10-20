'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'addresses',
      [
        {
          id: 1,
          user_id: 13, // Alice
          title: 'Home',
          address_line_1: 'King Fahd Road, Tower 3, Apt 402',
          address_line_2: 'Al Olaya District',
          country: 'Saudi Arabia',
          city: 'Riyadh',
          postal_code: '12214',
          landmark: 'Opposite Kingdom Centre',
          phone_number: '+966551122334',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          user_id: 13, // Alice
          title: 'Work Office',
          address_line_1: 'Digital City, R&D Building A3',
          address_line_2: 'Floor 4, Suite 410',
          country: 'Saudi Arabia',
          city: 'Riyadh',
          postal_code: '12382',
          landmark: 'Next to Innovation Hub',
          phone_number: '+966551122334',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 3,
          user_id: 14, // Bob
          title: 'Primary Residence',
          address_line_1: 'Prince Sultan Street, Villa 18',
          address_line_2: 'Al Rawdah District',
          country: 'Saudi Arabia',
          city: 'Jeddah',
          postal_code: '23432',
          landmark: 'Behind Al Danube Supermarket',
          phone_number: '+966559988776',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('addresses_id_seq', (SELECT GREATEST(MAX(id), 1) FROM addresses));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'addresses',
      {
        id: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
