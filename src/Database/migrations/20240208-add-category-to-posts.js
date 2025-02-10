'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Posts', 'category', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'FAITH & SPIRITUALITY'
      });
      
      // Add the validation as a check constraint
      await queryInterface.sequelize.query(`
        ALTER TABLE "Posts"
        ADD CONSTRAINT category_values_check
        CHECK (category IN ('FAITH & SPIRITUALITY', 'PERSONAL GROWTH & SELF DISCOVERY', 'KINDNESS & COMPASSION', 'VLOG'))
      `);
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove the check constraint first
      await queryInterface.sequelize.query(`
        ALTER TABLE "Posts"
        DROP CONSTRAINT IF EXISTS category_values_check
      `);
      
      await queryInterface.removeColumn('Posts', 'category');
    } catch (error) {
      console.error('Migration rollback failed:', error);
      throw error;
    }
  }
};
