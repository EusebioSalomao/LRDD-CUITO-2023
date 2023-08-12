import { Router } from "express";
const router = Router()
import { adCurso, allCursos, editCurso, excluirCurso, wAdCurso, wEditCurso } from "../controlles/curso.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";

router.get('/', veryLogin, allCursos)
router.get('/add/:id', eAdmin, veryLogin, wAdCurso)
router.post('/add', eAdmin, veryLogin, adCurso)
router.get('/editar/:id', eAdmin, veryLogin, wEditCurso)
router.post('/editar', eAdmin, veryLogin, editCurso)
router.get('/excluir/:id', eAdmin, veryLogin, excluirCurso)


export default router