import Sequelize, { Model } from 'sequelize'

class Categories extends Model {
  static init(sequelize) {
    super.init(
      {
        name_category: Sequelize.STRING,
      },
      {
        sequelize,
      },
    )

    return this
  }

  static associate(models) {
    this.hasMany(models.Exercicies, {
      foreignKey: 'category_id',
      as: 'exercicies',
    });

    this.hasMany(models.PatientData, {
      foreignKey: 'list_of_exercises_id',
      as: 'patients',
    });
  }
}

export default Categories