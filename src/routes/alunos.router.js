import {Router} from 'express'
import { fichaAluno, matricular, tdAlunos, wAdmitir } from '../controlles/aluno.controll.js'
import { eAdmin, veryLogin } from '../../helpers/eAdmin.js'
const router = Router()

router.get('/', eAdmin, veryLogin, tdAlunos)
router.get('/matricular/:id', eAdmin, veryLogin, wAdmitir)
router.post('/matricular/:id', eAdmin, veryLogin, matricular)
router.get('/ficha/:id', veryLogin, fichaAluno)

export default router