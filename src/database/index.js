import Sequelize from 'sequelize'

import configDatabase from '../config/database'
import PatientData from '../app/models/PatientData'
import Exercicies from '../app/models/Exercicies'
import Doctors from '../app/models/doctors'
import ConsultationData from '../app/models/ConsultationData'
import Categories from '../app/models/Categories'
import UserReception from '../app/models/UserReception'
import ExerciseInformation from '../app/models/ExerciseInformation'

const models = [
  PatientData, 
  Exercicies, 
  Doctors, 
  ConsultationData, 
  Categories, 
  UserReception,
  ExerciseInformation,
]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(configDatabase)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      )
  }
}

export default new Database()