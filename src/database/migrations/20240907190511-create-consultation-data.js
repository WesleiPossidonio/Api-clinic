'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('consultation_data', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      doctor_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'doctors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      consultation_hours: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      consultation_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patients_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email_client: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patients_cpf: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      service_type: {
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('consultation-data')
  },
}
