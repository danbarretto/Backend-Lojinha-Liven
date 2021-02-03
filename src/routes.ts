import { Router } from 'express'
import UserController from './controllers/userController'
import AuthController from './controllers/authController'
import checkJwt from './middleware/checkJwt'
import AddressController from './controllers/addressController'

const routes = Router()


routes.post('/auth/createaccount', AuthController.createAccount)
routes.post('/auth/login', AuthController.login)
routes.get('/user/:id', checkJwt, UserController.getUserInfo)
routes.get('/user', checkJwt, UserController.searchUserInfo)
routes.put('/user/updateinfo', checkJwt, UserController.updateInfo)
routes.delete('/user/deleteaccount', checkJwt, UserController.deleteAccount)

routes.post('/address/createAddress',checkJwt, AddressController.createAddress)
routes.get('/address/:id', checkJwt, AddressController.getUserAddress)
routes.get('/address', checkJwt, AddressController.searchAddressInfo)
routes.put('/address/updateAddress', checkJwt, AddressController.updateAddress)
routes.delete('/address/deleteAddress', checkJwt, AddressController.deleteAddress)

export default routes