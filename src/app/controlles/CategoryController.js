import * as Yup from 'yup'
import Categories from '../models/Categories'
import Exercicies from '../models/Exercicies'

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name_category: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name_category } = request.body

    const category = await Categories.create({ name_category })

    return response.json(category)
  }

  async index(request, response) {
    const category = await Categories.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: Exercicies,
          as: 'exercicies',
          attributes: [
            'id',
            'url_video',
            'name_exercicies',
            'description_exercicies',
            'category_id'
          ]
        }
      ]
    })
    return response.json(category)
  }
}

export default new CategoryController()