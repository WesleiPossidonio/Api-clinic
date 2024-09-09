import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

// Configuração do Multer para aceitar vídeos
const multerConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1200 * 1024 * 1024, // Limite de 1200MB para vídeos
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['video/mp4', 'video/avi'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Apenas vídeos MP4 e AVI são permitidos.'));
    }
  },
};

// Configurando o Multer para aceitar um único arquivo chamado "video"
const upload = multer(multerConfig);

// Middleware para fazer upload para o Google Drive
const uploadToGoogleDrive = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('Nenhum arquivo encontrado.');
    }

    const videoFile = req.file;
    const fileExt = extname(videoFile.originalname);
    const fileName = `${uuidv4()}${fileExt}`;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_DRIVE_TYPE,
        project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_DRIVE_AUTH_URI,
        token_uri: process.env.GOOGLE_DRIVE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_DRIVE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_DRIVE_CLIENT_CERT_URL,
        universe_domain: process.env.GOOGLE_DRIVE_UNIVERSE_DOMAIN,
      },
      scopes: 'https://www.googleapis.com/auth/drive',
    });

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_API_FOLDER_ID],
    };

    const media = {
      mimeType: videoFile.mimetype,
      body: Readable.from([videoFile.buffer]),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'webViewLink, id',
    });

    const fileId = response.data.id;
    const directLink = `https://lh3.googleusercontent.com/d/${fileId}?authuser=0`;

    req.videoUrl = directLink;

    next();
  } catch (error) {
    console.error('Erro ao fazer upload do vídeo para o Google Drive:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Exportando as funções corretamente
export { upload, uploadToGoogleDrive };
