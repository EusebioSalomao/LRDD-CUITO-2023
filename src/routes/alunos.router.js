import {Router} from 'express'
import { fichaAluno, matricular, tdAlunos, wAdmitir } from '../controlles/aluno.controll.js'
import { eAdmin, veryLogin } from '../../helpers/eAdmin.js'
const router = Router()

router.get('/', veryLogin, eAdmin, tdAlunos)
router.get('/matricular/:id', veryLogin, eAdmin, wAdmitir)
router.post('/matricular/:id', veryLogin, eAdmin, matricular)
router.get('/ficha/:id', veryLogin, fichaAluno)

export default router