'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'sellers',
      [
        {
          id: 1,
          user_id: 11, // tech_seller
          business_name: 'Apex Electronics Hub',
          tax_id: 'TAX-SA-99887711',
          iban: 'SA8010000001234567890123',
          bank_account_owner: 'Apex Trading Corp',
          bank_name: 'Al Rajhi Bank',
          phone: '+966500001111',
          commission_rate: 5.00,
          is_approved: true,
          approved_at: now,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 2,
          user_id: 12, // fashion_seller
          business_name: 'Moda Trendz Boutique',
          tax_id: 'TAX-SA-11223344',
          iban: 'SA8020000009876543210987',
          bank_account_owner: 'Moda Global LLC',
          bank_name: 'Saudi National Bank',
          phone: '+966500002222',
          commission_rate: 7.50,
          is_approved: true,
          approved_at: now,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('sellers_id_seq', (SELECT GREATEST(MAX(id), 1) FROM sellers));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'sellers',
      {
        id: {
          [Op.in]: [1, 2],
        },
      },
      {}
    );
  },
};
