import * as yup from 'yup'
import ConsultationData from '../models/ConsultationData'
import Doctors from '../models/doctors'

class ConsultationDataController {
  async store(request, response) {
    const schema = yup.object().shape({
      doctor_id: yup.string().required(),
      consultation_hours: yup.string().required(),
      consultation_date: yup.string().required(),
      patients_name: yup.string().required(),
      email_client: yup.string().email().required(),
      patients_cpf: yup.string().required(),
      service_type: yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const {
      doctor_id,
      consultation_date,
      consultation_hours,
      patients_name,
      email_client,
      patients_cpf,
      service_type,
    } = request.body

    const doctorsIdExists = await Doctors.findOne({
      where: { id: doctor_id },
    });

    if (!doctorsIdExists) {
      return response.status(400).json({ error: 'Doutor Não Encontrado' });
    }

    const newConsultationData = await ConsultationData.create({
      doctor_id,
      consultation_date,
      consultation_hours,
      patients_name,
      email_client,
      patients_cpf,
      service_type,
    })

    return response.status(201).json(newConsultationData)
  }

  async index(request, response) {
    const listConsultationData = await ConsultationData.findAll({
      include: {
        model: Doctors,
        as: 'doctor_data',
      },
    })

    return response.status(201).json(listConsultationData)
  }

  async update(response, request) {
    const schema = yup.object().shape({
      doctor_id: yup.number().optional(),
      consultation_hours: yup.string().optional(),
      consultation_date: yup.string().optional(),
      patients_name: yup.string().optional(),
      email_client: yup.string().email().optional(),
      patients_cpf: yup.string().optional(),
      service_type: yup.string().optional(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const consultationDataExists = await ConsultationData.findOne({
      where: { id },
    })

    if (!consultationDataExists) {
      return response.status(400).json({ error: 'Consulta Não Encontrada' })
    }

    const {
      consultation_date,
      consultation_hours,
      patients_name,
      email_client,
      patients_cpf,
      service_type,
    } = request.body

    await ConsultationData.update(
      {
        consultation_date,
        consultation_hours,
        patients_name,
        email_client,
        patients_cpf,
        service_type,
      },
      { where: { id } },
    )

    return response.json({ message: 'status was update sucessfully' })
  }

  async delete(response, request) {
    const { id } = request.params

    const consultationDataExists = await ConsultationData.findOne({
      where: { id },
    })

    if (!consultationDataExists) {
      return response.status(400).json({ error: 'Consulta Não Encontrada' })
    }

    await ConsultationData.destroy({
      where: { id },
    })
  }
}

export default new ConsultationDataController()
