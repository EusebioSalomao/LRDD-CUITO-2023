import {Router} from 'express'
import { addDisciplina, tdDisciplina } from '../controlles/disciplina.controll.js';
import { eAdmin, veryLogin } from '../../helpers/eAdmin.js';
const router = Router()

router.get('/', veryLogin, tdDisciplina)
router.post('/add', eAdmin, veryLogin, addDisciplina)

export default router;