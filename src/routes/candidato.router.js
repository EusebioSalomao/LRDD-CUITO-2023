import {Router} from 'express'
import { aceitarCand, addCandCont, admitiCand, allCandidatos, consultCand, deleteCand, saveCandidato, saveEdidarCand, solicitacoes, wCandidato, wDetalheCand, wEdidarCand } from '../controlles/candidato.controll.js'
import {storage} from '../middlewares/uploadImage.midware.js'
import multer from 'multer'
import { eAdmin, veryLogin } from '../../helpers/eAdmin.js';
const upload = multer({storage: storage});
const router = Router()

router.get('/', veryLogin, allCandidatos)
router.get('/solicitacoes', veryLogin, solicitacoes)
router.get('/add', wCandidato)
router.post('/addCont', addCandCont)
router.post('/save', upload.single('fotoAluno'), saveCandidato)
router.get('/detalhes/:id', veryLogin, wDetalheCand)
router.get('/edidar/:id', eAdmin, veryLogin, wEdidarCand)
router.post('/edidar', eAdmin, veryLogin, saveEdidarCand)
router.get('/deletar/:id',eAdmin, veryLogin, deleteCand)
router.post('/consultar', consultCand)
router.post('/admitir', eAdmin, veryLogin, admitiCand)
router.post('/aceitarCand', eAdmin, veryLogin, aceitarCand)

export default router