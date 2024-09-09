import * as Yup from 'yup'

import PatientData from '../models/PatientData'
import ExerciseInformation from '../models/ExerciseInformation'

class ExerciseInformationController {
  async store(request, response) {
    const schema = Yup.object().shape({
      patinent_id: Yup.string().required(),
      name_exercise: Yup.string().required(),
      number_of_repetitions: Yup.string().required(),
      resume_exercise: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { 
      number_of_repetitions, 
      resume_exercise, 
      name_exercise, 
      patinent_id
    } = request.body

    const PatientDataIdExists = await PatientData.findOne({
      where: { id: patinent_id },
    });

    if (!PatientDataIdExists) {
      return response.status(400).json({ error: 'Paciente Não Encontrado' });
    }

    const dataExerciseInformation = {
      number_of_repetitions, 
      resume_exercise, 
      name_exercise, 
      patinent_id 
    }

    const createExercisesInformation = await ExerciseInformation.create(dataExerciseInformation)
    return response.json(createExercisesInformation)
  }

  async index(request, response) {
    const listInformationExercises = await ExerciseInformation.findAll()
    return response.json(listInformationExercises)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      patinent_id: Yup.number().optional(),
      name_exercise: Yup.string().optional(),
      resume_exercise: Yup.string().optional(),
      number_of_repetitions: Yup.string().optional(),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const exerciciesInformationExists = await ExerciseInformation.findOne({
      where: { id },
    })

    if (!exerciciesInformationExists) {
      return response.status(404).json({ error: 'Resumo do exercicio não encontrado!' })
    }

    const { 
      number_of_repetitions, 
      resume_exercise, 
      name_exercise, 
      patinent_id 
    } = request.body

    const dataExerciciesInformation = {
      number_of_repetitions, 
      resume_exercise, 
      name_exercise, 
      patinent_id 
    }

    const updateExerciciesInformation = await ExerciseInformation.update(dataExerciciesInformation)
    return response.status(201).json(updateExerciciesInformation)
  }

}

export default new ExerciseInformationController()