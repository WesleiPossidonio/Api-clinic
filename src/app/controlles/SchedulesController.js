import * as Yup from 'yup'
import Schedules from '../models/Schedules'

import { google } from 'googleapis'

const calendar = google.calendar('v3')
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
)
class SchedulesController {
  async store(request, response) {
    const schema = Yup.object().shape({
      doctor_id: Yup.string().required(),
      date: Yup.string().required(),
      startTime: Yup.string().required(),
      endTime: Yup.string().required(),
      state_schedules: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { 
      doctor_id, 
      state_schedules, 
      endTime, 
      startTime, 
      date 
    } = request.body

    const doctor = await Doctors.findByPk(doctor_id)

    if (!doctor) {
      return response.status(400).json({ error: 'Doutor Não Encontrado' })
    }


    const dateExists = await Schedules.findOne({
      where: {
        doctor_id: doctorId,
        date,
        start_time: startTime,
        end_time: endTime,
      },
    })

    if (dateExists) {
      return response
        .status(400)
        .json({ error: 'Horário já cadastrado para essa data e hora.' })
    }


    oauth2Client.setCredentials({
      access_token: doctor.google_access_token,
      refresh_token: doctor.google_refresh_token,
    })

    try {
      const calendarEvent = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: doctor.google_calendar_email,
        resource: {
          summary: `Horário disponível`,
          start: {
            dateTime: `${date}T${startTime}`,
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: `${date}T${endTime}`,
            timeZone: 'America/Sao_Paulo',
          },
        },
      })

      const availability = {
        doctor_id: doctor_id,
        date,
        start_time: startTime,
        end_time: endTime,
        google_event_id: calendarEvent.data.id,
        state_schedules: state_schedules,
      }

      const createDate = await Schedules.create(availability)
      return response.status(201).json(createDate)
    } catch (error) {
      return response
        .status(500)
        .json({ error: 'Erro ao criar evento no Google Calendar. =>', error })
    }
  }

  async index(request, response) {
    const category = await Schedules.findAll()
    return response.json(category)
  }
}

export default new SchedulesController()