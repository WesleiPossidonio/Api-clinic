import Sequelize, { Model } from 'sequelize'

class ConsultationData extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        doctor_id: Sequelize.UUID,
        schedules_id: Sequelize.UUID,
        patients_name: Sequelize.STRING,
        email_client: Sequelize.STRING,
        patients_cpf: Sequelize.STRING,
        service_type: Sequelize.STRING,
      },
      {
        sequelize,
      },
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Doctors, {
      foreignKey: 'doctor_id', 
      as: 'doctor',
    });

    this.hasMany(models.Schedules, {
      foreignKey: 'id',
      as: 'list_availability',
    })
  }
}

export default ConsultationData
