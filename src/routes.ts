import { Router } from 'express'
import UserController from './controllers/userController'
import AuthController from './controllers/authController'
import checkJwt from './middleware/checkJwt'

const routes = Router()


routes.post('/auth/createaccount', AuthController.createAccount)
routes.post('/auth/login', AuthController.login)
routes.get('/user/:id', checkJwt, UserController.getUserInfo)
routes.get('/user', checkJwt, UserController.searchUserInfo)
routes.put('/user/updateinfo', checkJwt, UserController.updateInfo)
routes.delete('/user/deleteaccount', checkJwt, UserController.deleteAccount)

export default routes