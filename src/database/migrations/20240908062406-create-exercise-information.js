'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('exercise_information', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    patinent_id: {
      type: Sequelize.UUID,
      references: {
        model: 'patient_data', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    name_exercise: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    resume_exercise: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    number_of_repetitions: {
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
    await queryInterface.dropTable('exercise_information')
  }
};
