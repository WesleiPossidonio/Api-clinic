import * as Yup from 'yup'
import PatientData from '../models/PatientData'
import ExerciseInformation from '../models/ExerciseInformation'
import Categories from '../models/Categories'
import Exercicies from '../models/Exercicies'

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
      where: { email_patient: email },
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
    const listPatient = await PatientData.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: ExerciseInformation,
          as: 'exercise_information', // Verifique se o alias 'exercise_information' está correto
          attributes: [
            'patinent_id',
            'name_exercise',
            'number_of_repetitions',
            'resume_exercise',
          ],
        },
        {
          model: Categories,
          as: 'list_execicies', // Verifique se o alias está correto
          attributes: ['name_category'],
          include: [
            {
              model: Exercicies,
              as: 'exercicies', // Verifique se o alias 'exercicies' está correto
              attributes: [
                'id',
                'url_video',
                'name_exercicies',
                'description_exercicies',
                'category_id',
              ]
            }
          ]
        }
      ]
    });
    return response.json(listPatient);
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