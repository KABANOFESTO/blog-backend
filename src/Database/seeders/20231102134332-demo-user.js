'use strict';

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10; // Number of salt rounds for bcrypt

    const hashedPasswordAdmin = await bcrypt.hash("umwiza", saltRounds);

    await queryInterface.bulkInsert('Users', [{
      firstName: 'UMWIZA',
      lastName: 'Maureen',
      profile: 'https://res.cloudinary.com/da12yf0am/image/upload/v1711263166/pmeqjiziugbrath7vkps.jpg',
      email: 'maureekalala@gmail.com', 
      role: 'admin',
      password: hashedPasswordAdmin,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Messages', [
      {
        names: 'John Doe',
        email: 'john@example.com',
        subject: 'Hello',
        message: 'This is a sample message.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        names: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Greetings',
        message: 'Just wanted to say hi!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add more sample data as needed
    ], {});

  },

  async down(queryInterface, Sequelize) {
    // Add commands to revert seed data here
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Messages', null, {});
  }
};
