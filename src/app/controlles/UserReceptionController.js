import * as Yup from 'yup'
import UserReception from '../models/UserReception'

class UserReceptionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      registration_number: Yup.string().required(),
      admin: Yup.boolean().required(),
      password: Yup.string().required().min(6),
      type_user: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { 
      admin, 
      registration_number, 
      email, 
      name,
      password,
      type_user
    } = request.body
    
    const patientDatExists = await UserReception.findOne({
      where: { email },
    });

    if ( patientDatExists) {
      return response.status(400).json({ error: 'Email já cadastrado' });
    }

    const dataUserReception = {
      password, 
      admin, 
      registration_number, 
      email, 
      name,
      type_user
    }

    const createUserReception = await UserReception.create(dataUserReception)
    return response.json(createUserReception)
  }

  async index(request, response) {
    const listUserReception = await UserReception.findAll()
    return response.json(listUserReception)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.number().optional(),
      email: Yup.number().optional(),
      registration_number: Yup.string().optional(),
      admin: Yup.boolean().optional(),
      password: Yup.string().optional().min(6),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const userReceptionExists = await UserReception.findOne({
      where: { id },
    })

    if (!userReceptionExists) {
      return response.status(404).json({ error: 'Usuário não encontrado!' })
    }

    const { 
      password, 
      admin, 
      registration_number, 
      email, 
      name,
    } = request.body

    if (name) userReceptionExists.name = name;
    if (registration_number) userReceptionExists.registration_number = name;
    if (email) userReceptionExists.email = email;
    if (admin !== undefined) userReceptionExists.admin = admin; // Verifica explicitamente valores booleanos
    if (password) userReceptionExists.password = password; // Isso acionará o hook para gerar o hash da senha
  
    // Salvar as alterações no banco
    await userReceptionExists.save();
    return response.status(200).json({ message: 'Dados do médico atualizados com sucesso!' });
  }

}

export default new UserReceptionController()