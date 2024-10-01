'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      doctor_id: {
        type: Sequelize.UUID,
        references: {
          model: 'doctors', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
     hours: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      state_schedules: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
     })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('schedules')
  }
};
