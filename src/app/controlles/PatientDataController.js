import * as Yup from 'yup'
import PatientData from '../models/PatientData'

class PatientDataController {
  async store(request, response) {
    const schema = Yup.object().shape({
      list_of_exercises_id: Yup.number().required(),
      doctor_id: Yup.string().required(),
      name_patient: Yup.string().required(),
      email_patient: Yup.string().required(),
      password: Yup.string().optional().min(6),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { 
      password, 
      email_patient, 
      name_patient, 
      doctor_id,
      list_of_exercises_id
    } = request.body

    const patientDatExists = await PatientData.findOne({
      where: { email },
    });

    if ( patientDatExists) {
      return response.status(400).json({ error: 'Email já cadastrado' });
    }

    const dataPatient = {
      password, 
      email_patient, 
      name_patient, 
      doctor_id,
      list_of_exercises_id
    }

    const createdataPatient = await PatientData.create(dataPatient)
    return response.json(createdataPatient)
  }

  async index(request, response) {
    const listPatient = await PatientData.findAll()
    return response.json(listPatient)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name_patient: Yup.string().optional(),
      email_patient: Yup.string().optional(),
      password: Yup.string().optional().min(6),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const patientExists = await PatientData.findOne({
      where: { id },
    })

    if (!patientExists) {
      return response.status(404).json({ error: 'Paciente não encontrado!' })
    }

    const { 
      password,
      email_patient,
      name_patient,
    } = request.body

    const newDataPatient = {
      password,
      email_patient,
      name_patient,
    }

    const updateDataPatient = await PatientData.update(newDataPatient)
    return response.status(201).json(updateDataPatient)
  }

}

export default new PatientDataController()