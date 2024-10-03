import * as yup from 'yup'
import nodemailer from 'nodemailer'
import mjml2html from 'mjml'
import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    )

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    })

    const accessToken = await oauth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        accessToken: accessToken.token, // Use o token obtido via OAuth2
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    })

    return transporter
  } catch (error) {
    console.error('Erro ao criar o transportador:', error)
    throw error
  }
}

export const SendMailUpdatePassword = async (data) => {
  const schema = yup.object().shape({
    name_patient: yup.string().required(),
    email_patient: yup.string().email().required(),
    update_number: yup.string().required(),
  })

  const { name_patient, email_patient, update_number } = data

  try {
    await schema.validate(data, { abortEarly: false })
  } catch (error) {
    return {
      status: 400,
      error: 'Dados do formulário inválidos.',
      details: error.errors,
    }
  }

  const mjmlCode = `
      <mjml version="3.3.3">
  <mj-body background-color="#fff" color="#000" font-family="Arial, sans-serif">
    <mj-section background-color="#f2f2f2" padding="20px 0" text-align="center">
      <mj-column>
        <mj-image object-fit="cover" padding="0" src="https://i.imgur.com/PsbpWpE.jpeg" width="100%"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section background-color="#f2f2f2" padding="0px 0px 20px 0px" text-align="center">
      <mj-column>
        <mj-text><h2>Olá ${name_patient}!</h2></mj-text>
        <mj-text>
          Recebemos sua solicitação para acessar o seu dashboard de exercícios. Para criar sua nova senha e concluir o acesso, utilize o código abaixo:
        </mj-text>
        <mj-text><h1>Código de verificação: ${update_number}</h1></mj-text>
        <mj-text>Clique no link a seguir para criar sua senha: <br/><a href="#" target="_blank">Acessar Dashboard</a></mj-text>
        <mj-text>Se você não fez essa solicitação, por favor, entre em contato conosco para garantir a segurança da sua conta.</mj-text>
        <mj-text>Atenciosamente,<br/>Clínica Corpo & Mente</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>

  `

  let html
  try {
    const { html: convertedHtml } = mjml2html(mjmlCode)
    html = convertedHtml
  } catch (error) {
    console.error('Erro ao converter o MJML em HTML:', error)
    return { status: 500, error: 'Erro ao processar template do email.' }
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: email_patient,
    subject: 'Código de Verificação',
    html,
  }

  try {
    const transporter = await createTransporter()
    await transporter.sendMail(mailOptions)
    console.log('Email enviado com sucesso!')
    return { status: 200, success: 'E-mail enviado com sucesso.' }
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error)
    return { status: 500, error: 'Erro ao enviar o e-mail.' }
  }
}
