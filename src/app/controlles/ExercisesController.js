import * as yup from 'yup'
import fs from 'fs/promises'
import Exercicies from '../models/Exercicies'

class ExercisesController {
  async store(request, response) {
    try {
      const schema = yup.object().shape({
        category_id: yup.number().required(),
        name_exercicies: yup.string().required(),
        description_exercicies: yup.string().required(),
      });

      try {
        await schema.validate(request.body, { abortEarly: false });
      } catch (err) {
        return response.status(400).json({ error: err.errors });
      }

      const {
        description_exercicies,
        name_exercicies,
        category_id,
      } = request.body;

      // Pegue o valor do URL gerado pelo Google Drive
      const url_video = request.videoUrl; // Correção aqui

      const exercisesExists = await Exercicies.findOne({
        where: { name_exercicies },
      });

      if (exercisesExists) {
        return response.status(400).json({ error: 'Exercício já cadastrado' });
      }

      // Criação do exercício com o link do vídeo correto
      const exercisesData = await Exercicies.create({
        description_exercicies,
        url_video,
        name_exercicies,
        category_id,
      });

      return response.json(exercisesData);
    } catch (error) {
      console.error('Erro no método store do ExercisesController:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async index(request, response) {
    const listExercices = await Exercicies.findAll()
    return response.json(listExercices)
  }

  async update(request, response) {
    const schema = yup.object().shape({
      category_id: yup.number().optional(),
      name_exercicies: yup.string().optional(),
      url_video: yup.string().optional(),
      description_exercicies: yup.string().optional(),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const exerciseExists = await Exercicies.findOne({ where: { id } })

    if (!exerciseExists) {
      return response.status(404).json({ error: 'Exercício não encontrado!' })
    }

    const { name_exercicies, category_id, url_video, description_exercicies } =
      request.body

    let newUrlVideo = exerciseExists.url_video

    // Verifica se há um novo vídeo para atualizar
    if (request.files && request.files.url_video) {
      const uploadedVideo = await uploadVideoToDrive(
        request.files.url_video[0].path,
        'video/mp4',
        process.env.GOOGLE_API_FOLDER_ID,
      )
      newUrlVideo = uploadedVideo.data.webViewLink

      // Exclui o vídeo temporário após o upload
      await fs.unlink(request.files.url_video[0].path)
    }

    await updatedExercises.update({
      name_exercicies,
      category_id,
      url_video: newUrlVideo,
      description_exercicies,
    })

    return response.status(200).json(updatedExercises)
  }
}

export default new ExercisesController()
