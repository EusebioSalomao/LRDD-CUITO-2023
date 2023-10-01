import { Router } from "express";
import { addAluno, admin, apagarAluno, apagarAluno2, editarFoto, editarTurma, eliminarTurma } from "../controlles/admin.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/:id', veryLogin, eAdmin, admin)
router.post('/editFoto', veryLogin, editarFoto)
router.post('/addAluno',veryLogin, eAdmin, addAluno)
router.get('/apagarAluno/:id', veryLogin, eAdmin, apagarAluno)
router.post('/apagarAluno2/', veryLogin, eAdmin, apagarAluno2)
router.post('/eliminarTurma/', eAdmin, eliminarTurma)
router.post('/editarTurma/',veryLogin, eAdmin, editarTurma)

export default router