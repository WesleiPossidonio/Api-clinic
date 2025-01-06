import Sequelize, { Model, STRING } from 'sequelize'

class Schedules extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        doctor_id: Sequelize.UUID,
        date: Sequelize.STRING,
        start_time: Sequelize.TIME,
        end_time: Sequelize.TIME,
        state_schedules: STRING,
        google_event_id: Sequelize.STRING,
      },
      {
        sequelize,
      },
    )

    return this
  }

  static associate(models) {

    this.belongsTo(models.Doctors, {
      foreignKey: 'id',
      as: 'doctor_schedules',
    });
  }

}

export default Schedules