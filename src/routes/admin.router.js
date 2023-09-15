import { Router } from "express";
import { addAluno, admin, editarFoto, editarTurma, eliminarTurma } from "../controlles/admin.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/:id', veryLogin, eAdmin, admin)
router.post('/editFoto', veryLogin, editarFoto)
router.post('/addAluno',veryLogin, eAdmin, addAluno)
router.post('/eliminarTurma/', eAdmin, eliminarTurma)
router.post('/editarTurma/',veryLogin, eAdmin, editarTurma)

export default router