import { Router } from 'express'
import CategoryController from './app/controlles/CategoryController'
import ConsultationDataController from './app/controlles/ConsultationDataController'
import DoctorsController from './app/controlles/DoctorsController'
import ExerciseInformationController from './app/controlles/ExerciseInformationController'
import ExercisesController from './app/controlles/ExercisesController'
import PatientDataController from './app/controlles/PatientDataController'
import UserReceptionController from './app/controlles/UserReceptionController'
import SessionController from './app/controlles/SessionController'
import { upload, uploadToGoogleDrive } from './config/multer'; 

import authMiddlewares from './app/meddlewares/auth'

const routes = new Router()

routes.post('/session', SessionController.store)

// routes.use(authMiddlewares)
routes.post('/createCategory', CategoryController.store)
routes.get('/getListCategory', CategoryController.index)

routes.post('/createConsult', ConsultationDataController.store)
routes.get('/getListConsult', ConsultationDataController.index)

routes.post('/createDoctor', DoctorsController.store)
routes.get('/getListDoctor', DoctorsController.index)

routes.post('/createUserReception', UserReceptionController.store)
routes.get('/getUserReception', UserReceptionController.index)

routes.post('/createExercisesInformation', ExerciseInformationController.store)
routes.get('/getListExercisesInformation', ExerciseInformationController.index)

routes.post('/createExercises', upload.single('url_video'), uploadToGoogleDrive, ExercisesController.store)
routes.get('/getExercises', ExercisesController.index)

routes.post('/createPatient', PatientDataController.store)
routes.get('/getPatient', PatientDataController.index)

export default routes