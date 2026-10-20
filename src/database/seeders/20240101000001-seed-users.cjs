'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const now = new Date();

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 10,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
          first_name: 'Admin',
          last_name: 'Super',
          username: 'admin_master',
          email: 'admin@amalzone.com',
          password: passwordHash,
          date_of_birth: '1988-06-12',
          phone_number: '+966501110000',
          role: 'admin',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 11,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
          first_name: 'Ahmed',
          last_name: 'Al-Mansoor',
          username: 'tech_seller',
          email: 'tech_seller@amalzone.com',
          password: passwordHash,
          date_of_birth: '1992-04-18',
          phone_number: '+966500001111',
          role: 'seller',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 12,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          first_name: 'Fatima',
          last_name: 'Zahra',
          username: 'fashion_seller',
          email: 'fashion_seller@amalzone.com',
          password: passwordHash,
          date_of_birth: '1995-11-23',
          phone_number: '+966500002222',
          role: 'seller',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 13,
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
          first_name: 'Alice',
          last_name: 'Smith',
          username: 'alice_customer',
          email: 'alice@amalzone.com',
          password: passwordHash,
          date_of_birth: '1998-09-05',
          phone_number: '+966551122334',
          role: 'customer',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        {
          id: 14,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
          first_name: 'Bob',
          last_name: 'Johnson',
          username: 'bob_customer',
          email: 'bob@amalzone.com',
          password: passwordHash,
          date_of_birth: '1996-03-30',
          phone_number: '+966559988776',
          role: 'customer',
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('users_id_seq', (SELECT GREATEST(MAX(id), 1) FROM users));"
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      'users',
      {
        id: {
          [Op.in]: [10, 11, 12, 13, 14],
        },
      },
      {}
    );
  },
};
