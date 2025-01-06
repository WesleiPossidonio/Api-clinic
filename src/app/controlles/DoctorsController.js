import * as Yup from 'yup'

import PatientData from '../models/PatientData'
import ExerciseInformation from '../models/ExerciseInformation'
import Categories from '../models/Categories'
import Exercicies from '../models/Exercicies'
import Doctors from '../models/Doctors'
import Schedules from '../models/Schedules'

import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth2callback',
)

class DoctorsController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      number_register: Yup.string().required(),
      email: Yup.string().email().required(),
      position: Yup.string().required(),
      type_user: Yup.string().required(),
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
      password,
      type_user,
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
      password,
      type_user,
    }

    try {
      await Doctors.create(dataDoctor)
      // return response.status(201).json(createDoctors)

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
      });

      // return response.status(201).json({
      //   redirectUrl: authUrl, // Envie a URL de autenticação para que o cliente possa se conectar ao Google
      // });

      return response.status(201).json({
        message: 'Doutor criado com sucesso!',
        authUrl, // Envie a URL de autenticação para que o cliente possa se conectar ao Google
      });

    } catch (error) {
      console.error('Erro ao criar doutor:', error);
      return response.status(500).json({ error: 'Erro ao criar doutor' });
    }

  }

  async index(request, response) {
    const listDoctors = await Doctors.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: PatientData,
          as: 'patients',
          attributes: [
            'id',
            'list_of_exercises_id',
            'doctor_id',
            'name_patient',
            'email_patient',
          ], 
          include: [
            {
              model: ExerciseInformation,
              as:  'exercise_information',
              attributes: [
                'patinent_id',
                'name_exercise',
                'number_of_repetitions',
                'resume_exercise',
              ], 
            }, 
            {
              model: Categories,
              as: 'list_execicies',
              attributes: ['name_category', 'id'],
              include: [
                {
                  model: Exercicies,
                  as: 'exercicies', 
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
          ],
        }, {
          model: Schedules,
          as: 'doctor_schedules',
          attributes: [
            'id',
            'date',
            'start_time',
            'end_time',
            'state_schedules',
          ], 
        }
      ]
    })
    return response.json(listDoctors)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().optional(),
      number_register: Yup.string().optional(),
      email: Yup.string().email().optional(),
      position: Yup.string().optional(),
      admin: Yup.boolean().optional(),
      password: Yup.string().optional().min(6),
    });
  
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
  
    const { id } = request.params;
  
    // Procurar pelo médico no banco
    const doctor = await Doctors.findOne({
      where: { id },
    });
  
    if (!doctor) {
      return response.status(404).json({ error: 'Usuário Não Encontrado' });
    }
  
    // Extrair os dados do corpo da requisição
    const { 
      name, 
      number_register, 
      email, 
      position, 
      admin, 
      password 
    } = request.body;
  
    // Atualizar os campos fornecidos
    if (name) doctor.name = name;
    if (number_register) doctor.number_register = number_register;
    if (email) doctor.email = email;
    if (position) doctor.position = position;
    if (admin !== undefined) doctor.admin = admin; // Verifica explicitamente valores booleanos
    if (password) doctor.password = password; // Isso acionará o hook para gerar o hash da senha
  
    // Salvar as alterações no banco
    await doctor.save();
  
    return response.status(200).json({ message: 'Dados do médico atualizados com sucesso!' });
  }

  async oauth2callback(request, response) {
    const { code } = request.query // O código de autorização
    const { CLIENT_ID, CLIENT_SECRET } = process.env

    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'http://localhost:3000/oauth2callback',
    )

    try {
      // Trocar o código de autorização pelo access token
      const { tokens } = await oauth2Client.getToken(code)
      const { access_token, refresh_token } = tokens

      // Atualizar o banco de dados com os tokens do médico
      const doctorId = request.session.doctorId
      await Doctors.update(
        {
          google_access_token: access_token,
          google_refresh_token: refresh_token,
        },
        { where: { id: doctorId } },
      )

      // Redirecionar ou enviar uma resposta de sucesso
      response.status(200).json({ message: 'Tokens armazenados com sucesso!' })
    } catch (error) {
      console.error('Erro ao obter os tokens:', error)
      response
        .status(500)
        .json({ error: 'Erro ao processar o callback do Google.' })
    }
  }
  
}

export default new DoctorsController()