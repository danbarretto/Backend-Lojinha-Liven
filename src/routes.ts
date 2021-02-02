import { Router } from 'express'
import UserController from './controllers/userController'
import AuthController from './controllers/authController'
const routes = Router()


routes.post('/auth/createaccount', AuthController.createAccount)
routes.post('/auth/login', AuthController.login)
routes.get('/user/getuserinfo', UserController.getUserInfo)
routes.put('/user/updateinfo', UserController.updateInfo)
routes.delete('/user/deleteaccount', UserController.deleteAccount)

export default routes