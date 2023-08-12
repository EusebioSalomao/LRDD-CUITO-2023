import { Router } from "express";
import { addFuncionario, detalheF, editarF, saveEditar, saveFuncionario, tdFuncionarios } from "../controlles/funcionario.controll.js";
import {storage} from '../middlewares/uploadImage.midware.js'
import multer from 'multer'
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const upload = multer({storage: storage});
const router = Router()

router.get('/', veryLogin, tdFuncionarios)
router.get('/add', eAdmin, veryLogin, addFuncionario)
router.post('/saveFuncionario', eAdmin, veryLogin, upload.single('fotoProf'), saveFuncionario)
router.get('/detalhes/:id', veryLogin, detalheF)
router.get('/editar/:id', eAdmin, veryLogin, editarF)
router.post('/saveEditar', eAdmin, veryLogin, saveEditar)

export default router