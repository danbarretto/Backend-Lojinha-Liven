import { Router } from 'express'
import UserController from './controllers/userController'

const routes = Router()


routes.post('/user/create', UserController.createAccount)
routes.post('/user/login', UserController.login)
routes.get('/user/getuserinfo', UserController.getUserInfo)
routes.put('/user/updateinfo', UserController.updateInfo)
routes.delete('/user/deleteaccount', UserController.deleteAccount)

export default routes