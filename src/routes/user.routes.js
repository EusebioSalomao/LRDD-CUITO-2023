import { Router } from "express";
const router = Router();
import { addUser, allUsers, deletUser, editUser, login, logout, perfil, telaLogin, wAddUser, wEditUser } from "../controlles/user.controll.js";
import {validFildUser} from '../middlewares/user.middlewer.js'
import {storage} from '../middlewares/uploadImage.midware.js'
import multer from 'multer'
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const upload = multer({storage: storage});

router.get('/allUsers',veryLogin, eAdmin, allUsers)
router.get('/login', telaLogin)
router.post('/login', login)
router.get('/logout', veryLogin, logout)
router.get('/add', veryLogin, eAdmin, wAddUser)
router.post('/add', veryLogin, eAdmin, upload.single('fotoUser'), validFildUser, addUser)
router.get('/deletUser/:id', eAdmin, veryLogin, deletUser)
router.get('/editUser/:id', eAdmin, veryLogin, wEditUser)
router.post('/editUser', eAdmin, veryLogin, editUser)
router.get('/perfil', veryLogin, perfil)


export default router