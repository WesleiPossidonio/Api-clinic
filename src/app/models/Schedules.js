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
        hours: Sequelize.STRING,
        state_schedules: STRING
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