import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class PatientData extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        list_of_exercises_id: Sequelize.INTEGER,
        doctor_id: Sequelize.INTEGER,
        name_patient: Sequelize.STRING,
        email_patient: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      },
    )

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10)
      }
    })

    return this
  }

  static associate(models) {

    this.belongsTo(models.Categories, {
      foreignKey: 'list_of_exercises_id',
      as: 'list_execicies',
    })

    this.belongsTo(models.Doctors, {
      foreignKey: 'doctor_id',
      as: 'doctor',
    });

    this.hasMany(models.ExerciseInformation, {
      foreignKey: 'patinent_id',
      as: 'patient_exercises',
    });
  }

}

export default PatientData
