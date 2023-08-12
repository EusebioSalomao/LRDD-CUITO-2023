import {Router} from 'express'
import { aceitarSolicitacao, detalheNoticia, detalheOcorrencia, detalheSolic, enviarSolicitacao, gerirInformacoes, homeSecret, informase, novaOcorrencia, novasSolicitacoes, ocorrencias, servicos, servicosInfo } from '../controlles/secretaria.controll.js'
import {storage} from '../middlewares/uploadImage.midware.js'
import multer from 'multer'
import {eAdmin, eSecret, veryLogin} from '../../helpers/eAdmin.js';
import { authMidleware } from '../middlewares/auth.middleware.js';
const upload = multer({storage: storage});
const router = Router()


router.get('/', veryLogin, eSecret, homeSecret)
router.get('/ocorrencias', veryLogin, eSecret, ocorrencias)
router.post('/novaOcorrencia', veryLogin, eSecret, novaOcorrencia)
router.get('/servicos', veryLogin, servicos)
router.get('/servicosInfo', servicosInfo)
router.post('/enviarSolicitacao', veryLogin, upload.single('copOcorrencia'), enviarSolicitacao)
router.get('/detalheOcorrencia/:id', veryLogin, detalheOcorrencia)
router.get('/detalheSolic/:id', veryLogin, detalheSolic)
router.get('/gerirInformacoes', eSecret, gerirInformacoes)
router.get('/detalheInfo/:id', detalheNoticia)
router.get('/informase', informase)
router.get('/novasSolicitacoes', eSecret, novasSolicitacoes)
router.post('/aceitarSolicitacao', eSecret, aceitarSolicitacao)



export default router