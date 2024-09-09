import Sequelize, { Model } from 'sequelize'

class Exercicies extends Model {
  static init(sequelize) {
    super.init(
      {
        category_id: Sequelize.INTEGER,
        name_exercicies: Sequelize.STRING,
        url_video: Sequelize.STRING,
        description_exercicies: Sequelize.TEXT,
      },
      {
        sequelize,
      },
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Categories, {
      foreignKey: 'category_id',
      as: 'category',
    })
  }
}

export default Exercicies
