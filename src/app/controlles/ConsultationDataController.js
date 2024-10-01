import * as Yup from 'yup';
import ConsultationData from '../models/ConsultationData';
import Doctors from '../models/Doctors';
import Schedules from '../models/Schedules';

class ConsultationDataController {
  async store(request, response) {
    const schema = Yup.object().shape({
      doctor_id: Yup.string().required(),
      consultation_hours: Yup.string().required(),
      consultation_date: Yup.string().required(),
      patients_name: Yup.string().required(),
      email_client: Yup.string().email().required(),
      patients_cpf: Yup.string().required(),
      service_type: Yup.string().required(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const {
      doctor_id,
      consultation_date,
      consultation_hours,
      patients_name,
      email_client,
      patients_cpf,
      service_type,
    } = request.body;

    // Verificar se o doutor existe
    const doctorExists = await Doctors.findOne({
      where: { id: doctor_id },
    });

    if (!doctorExists) {
      return response.status(400).json({ error: 'Doutor Não Encontrado' });
    }

    // Verificar se o horário está disponível na tabela de horários
    const scheduleExists = await Schedules.findOne({
      where: {
        doctor_id,
        date: consultation_date,
        hours: consultation_hours,
        state_schedules: 'Disponivel', // Supondo que esse campo indique se o horário está livre
      },
    });

    if (!scheduleExists) {
      return response.status(400).json({ error: 'Horário não disponível para consulta.' });
    }

    // Criar a consulta
    const newConsultationData = await ConsultationData.create({
      doctor_id,
      consultation_date,
      consultation_hours,
      patients_name,
      email_client,
      patients_cpf,
      service_type,
    });

    // Atualizar a tabela Schedules para marcar o horário como "indisponível"
    await Schedules.update(
      { state_schedules: 'Indisponivel' }, // Atualiza o estado do horário para indisponível
      {
        where: {
          doctor_id,
          date: consultation_date,
          hours: consultation_hours,
        },
      }
    );

    return response.status(201).json(newConsultationData);
  }

  async index(request, response) {
    const listConsultationData = await ConsultationData.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: Doctors,
          as: 'doctor',
          attributes: ['id', 'position', 'number_register', 'name'],
        },
      ],
    });

    return response.status(200).json(listConsultationData);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      doctor_id: Yup.number().optional(),
      consultation_hours: Yup.string().optional(),
      consultation_date: Yup.string().optional(),
      patients_name: Yup.string().optional(),
      email_client: Yup.string().email().optional(),
      patients_cpf: Yup.string().optional(),
      service_type: Yup.string().optional(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { id } = request.params;

    // Buscar consulta existente
    const consultationDataExists = await ConsultationData.findOne({
      where: { id },
    });

    if (!consultationDataExists) {
      return response.status(400).json({ error: 'Consulta Não Encontrada' });
    }

    const {
      doctor_id,
      consultation_date,
      consultation_hours,
      patients_name,
      email_client,
      patients_cpf,
      service_type,
    } = request.body;

    // Verificar se o novo horário está disponível (se houver mudança de horário)
    if (consultation_hours && consultation_date) {
      const scheduleExists = await Schedules.findOne({
        where: {
          doctor_id: consultationDataExists.doctor_id,
          date: consultation_date,
          hours: consultation_hours,
          state_schedules: 'available',
        },
      });

      if (!scheduleExists) {
        return response.status(400).json({ error: 'Novo horário não está disponível.' });
      }

      // Marcar o antigo horário como disponível novamente
      await Schedules.update(
        { state_schedules: 'available' },
        {
          where: {
            doctor_id: consultationDataExists.doctor_id,
            date: consultationDataExists.consultation_date,
            hours: consultationDataExists.consultation_hours,
          },
        }
      );

      // Marcar o novo horário como indisponível
      await Schedules.update(
        { state_schedules: 'unavailable' },
        {
          where: {
            doctor_id: consultationDataExists.doctor_id,
            date: consultation_date,
            hours: consultation_hours,
          },
        }
      );
    }

    // Atualizar os dados da consulta
    await ConsultationData.update(
      {
        consultation_date,
        consultation_hours,
        patients_name,
        email_client,
        patients_cpf,
        service_type,
      },
      { where: { id } }
    );

    return response.json({ message: 'Consulta atualizada com sucesso' });
  }

  async delete(request, response) {
    const { id } = request.params;

    const consultationDataExists = await ConsultationData.findOne({
      where: { id },
    });

    if (!consultationDataExists) {
      return response.status(400).json({ error: 'Consulta Não Encontrada' });
    }

    await ConsultationData.destroy({
      where: { id },
    });

    return response.json({ message: 'Consulta deletada com sucesso' });
  }
}

export default new ConsultationDataController();
