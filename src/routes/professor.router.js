import { Router } from "express";
import { aplicarFalta, config, justificarFaltaDoAluno, lancarNota, listaAlunos, miniPauta, miniPautas, professor, solicitacoesProf, turmasDoProf } from "../controlles/professor.controll.js";
import { verifyLancamento } from "../middlewares/professor.middlewere.js";
import { veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/solicitacoesProf', veryLogin, solicitacoesProf)
router.get('/:id', veryLogin, professor)
router.get('/turmas/:id', veryLogin, turmasDoProf)
router.get('/listaAlunos/:id', veryLogin, listaAlunos)
router.get('/minipautas/:id', veryLogin, miniPautas)
router.get('/minipauta/:id', veryLogin, miniPauta)
router.get('/config', veryLogin, config)
router.post('/lancarNota', veryLogin, verifyLancamento, lancarNota)
router.post('/aplicarFalta', veryLogin, aplicarFalta)
router.post('/justificarFaltaDoAluno', veryLogin, justificarFaltaDoAluno)

export default router