import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class Doctors extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        number_register: Sequelize.STRING,
        email: Sequelize.STRING,
        position: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        type_user: Sequelize.STRING,
        google_access_token: Sequelize.TEXT,
        google_refresh_token: Sequelize.TEXT,
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
    this.hasMany(models.PatientData, {
      foreignKey: 'doctor_id',
      as: 'patients',
    });

    this.hasMany(models.Schedules, {
      foreignKey: 'doctor_id', 
      as: 'doctor_schedules',
    });

    this.hasMany(models.ConsultationData, {
      foreignKey: 'doctor_id', 
      as: 'consultations',
    });

  }
}

export default Doctors
