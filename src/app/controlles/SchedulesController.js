import * as Yup from 'yup'
import Schedules from '../models/Schedules'


class SchedulesController {
  async store(request, response) {
    const schema = Yup.object().shape({
      doctor_id: Yup.string().required(),
      date: Yup.string().required(),
      hours: Yup.string().required(),
      state_schedules: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { doctor_id, state_schedules, hours, date } = request.body

    const createSchedules = await Schedules.create({ 
      doctor_id, 
      state_schedules, 
      hours, 
      date
     })

    return response.json(createSchedules)
  }

  async index(request, response) {
    const category = await Schedules.findAll()
    return response.json(category)
  }
}

export default new SchedulesController()