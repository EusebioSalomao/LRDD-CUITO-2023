import { Router } from "express";
import { abrirCandidatura, activarAnoLectivo, adAnoLectivo, allAnosLectivos, deletarAnoLectivo, desactivarAnoLectivo, ecerrarCandidatura, editAnoLectivo, editSave, gerirCurso, wAdAnoLectivo, wConfigAnoLectivo } from "../controlles/anoLectivo.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/', eAdmin, veryLogin, allAnosLectivos)
router.get('/add', eAdmin, veryLogin, wAdAnoLectivo)
router.post('/add', eAdmin, veryLogin, adAnoLectivo)
router.get('/config/:id', veryLogin, wConfigAnoLectivo)
router.post('/deletar', eAdmin, veryLogin, deletarAnoLectivo)
router.get('/activar/:id', eAdmin, veryLogin, activarAnoLectivo)
router.post('/desativar', eAdmin, veryLogin, desactivarAnoLectivo)
router.post('/gerirCurso', veryLogin, gerirCurso)
router.get('/edit/:id', eAdmin, veryLogin, editAnoLectivo)
router.post('/editSave', eAdmin, veryLogin, editSave)
router.get('/abrirCandidatura/:id', eAdmin, veryLogin, abrirCandidatura)
router.get('/encerrarCandidatura/:id', eAdmin, veryLogin, ecerrarCandidatura)

export default router