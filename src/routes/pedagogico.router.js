import { Router } from "express";
import { alunos, atenderDec, autorizarJustific, classes, cursos, gerarPauta, matricular, minipautas, pauta, pautas, pedagogicoHome, pedidos, solicitacao, solicitacoes, turmas } from "../controlles/pedagogico.controll.js";
import { veryLogin } from "../../helpers/eAdmin.js";
import { declaracaoSemNota } from "../controlles/relatorios.controll.js";
const router = Router()

router.get('/', veryLogin, pedagogicoHome)
router.get('/minipautas', veryLogin, minipautas)
router.post('/gerarPauta', gerarPauta)
router.get('/pautas', veryLogin, pautas)
router.get('/pauta/:id', veryLogin, pauta)
router.get('/alunos', veryLogin, alunos)
router.get('/turmas', veryLogin, turmas)
router.get('/classes', veryLogin, classes)
router.get('/cursos', veryLogin, cursos)
router.get('/matricular', veryLogin, matricular)
router.get('/solicitacoes', veryLogin, solicitacoes)
router.get('/solicitacao/:idSolicitacao', veryLogin, solicitacao)
router.post('/autorizarJustific', veryLogin, autorizarJustific)
router.get('/pedidos', veryLogin, pedidos)
router.post('/atenderDec', veryLogin, atenderDec)
router.post('/declaracaoSemNota', veryLogin, declaracaoSemNota)

//router.get('/professores', professores)

export default router