import * as Yup from 'yup'
import Doctors from '../models/doctors'

class DoctorsController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      number_register: Yup.string().required(),
      email: Yup.string().email().required(),
      position: Yup.string().required(),
      admin: Yup.boolean().required(),
      password: Yup.string().required().min(6),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { 
      name, 
      number_register, 
      email, 
      position, 
      admin, 
      password 
    } = request.body

    const DoctorExists = await Doctors.findOne({
      where: { email },
    });

    if (DoctorExists) {
      return response.status(400).json({ error: 'Email já cadastrado' });
    }

    const dataDoctor = {
      name, 
      number_register, 
      email, 
      position, 
      admin, 
      password 
    }

    const createDoctors = await Doctors.create(dataDoctor)
    return response.status(201).json(createDoctors)
  }

  async index(request, response) {
    const listDoctors = await Doctors.findAll()
    return response.json(listDoctors)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().opcional(),
      number_register: Yup.string().opcional(),
      email: Yup.string().email().opcional(),
      position: Yup.string().opcional(),
      admin: Yup.boolean().opcional(),
      password: Yup.string().opcional().min(6),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const companyExists = await Doctors.findOne({
      where: { id },
    })

    if (!companyExists) {
      return response.status(404).json({ error: 'Usuário Não Encontrado' })
    }

    const { 
      name, 
      number_register, 
      email, 
      position, 
      admin, 
      password 
    } = request.body

    const dataDoctor = {
      name, 
      number_register, 
      email, 
      position, 
      admin, 
      password 
    }

    const updateDataDoctors = await Doctors.update(dataDoctor)
    return response.status(201).json(updateDataDoctors)
  }

}

export default new DoctorsController()