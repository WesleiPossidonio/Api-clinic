import Sequelize, { Model } from 'sequelize'

class ExerciseInformation extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        patinent_id: Sequelize.UUID,
        name_exercise: Sequelize.STRING,
        resume_exercise: Sequelize.TEXT,
        number_of_repetitions: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'exercise_information',
        timestamps: true,
      },
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.PatientData, {
      foreignKey: 'patinent_id',
      as: 'patient_exercises',
    })
  }
}

export default ExerciseInformation
