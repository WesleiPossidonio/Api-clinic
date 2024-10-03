import * as yup from 'yup'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import authConfig from '../../config/auth'
import UserReception from '../models/UserReception'
import PatientData from '../models/PatientData'
import Doctors from '../models/Doctors'

class SessionController {
  async store(request, response) {
    // Validação de email e senha
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    })

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Invalid email or password format' })
    }

    const { email, password } = request.body

    // Função para erro de autenticação
    const emailPasswordIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'Make sure your password or email are correct' })
    }

    // Função para verificar senha e retornar dados do usuário
    const checkUserAndPassword = async (user, passwordHash, userType) => {
      if (user && (await bcrypt.compare(password, passwordHash))) {
        return { user, userType }
      }
      return null
    }

    // Verificar em todas as tabelas (Doctors, UserReception, PatientData)
    let userData = null

    const doctorExists = await Doctors.findOne({ where: { email } })
    if (doctorExists) {
      userData = await checkUserAndPassword(doctorExists, doctorExists.password_hash, 'doctor')
    }

    const userReceptionExists = await UserReception.findOne({ where: { email } })
    if (userReceptionExists && !userData) {
      userData = await checkUserAndPassword(userReceptionExists, userReceptionExists.password_hash, 'userReception')
    }

    const patientExists = await PatientData.findOne({ where: { email_patient: email } })
    if (patientExists && !userData) {
      userData = await checkUserAndPassword(patientExists, patientExists.password_hash, 'patient')
    }

    // Se não encontrou o usuário ou a senha estiver incorreta
    if (!userData) {
      return emailPasswordIncorrect()
    }

    const { user, userType } = userData

    // Gerar token conforme o tipo de usuário
    let tokenData = {}
    switch (userType) {
      case 'doctor':
        tokenData = {
          id: user.id,
          name: user.name,
          number_register: user.number_register,
          email: user.email,
          position: user.position,
          admin: user.admin,
          type_user: user.type_user
        }
        break
      case 'userReception':
        tokenData = {
          id: user.id,
          name: user.name,
          registration_number: user.registration_number,
          email: user.email,
          admin: user.admin,
          type_user: user.type_user
        }
        break
      case 'patient':
        tokenData = {
          id: user.id,
          name_patient: user.name_patient,
          email_patient: user.email_patient,
          doctor_id: user.doctor_id,
          list_of_exercises_id: user.list_of_exercises_id,
          type_user: user.type_user
        }
        break
      default:
        return emailPasswordIncorrect()
    }

    // Retornar o token
    return response.json({
      token: jwt.sign(tokenData, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
