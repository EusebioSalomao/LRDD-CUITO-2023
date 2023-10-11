import { Router } from "express";
import { alunos, atenderDec, autorizarJustific, classes, cursos, gerarPauta, matricular, minipautas, pauta, pautas, pedagogicoHome, pedidos, solicitacao, solicitacoes, turmas } from "../controlles/pedagogico.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
import { declaracaoSemNota } from "../controlles/relatorios.controll.js";
const router = Router()

router.get('/', veryLogin, eAdmin, pedagogicoHome)
router.get('/minipautas', veryLogin, eAdmin, minipautas)
router.post('/gerarPauta',veryLogin, eAdmin, gerarPauta)
router.get('/pautas', veryLogin, eAdmin, pautas)
router.get('/pauta/:id', veryLogin, eAdmin, pauta)
router.get('/alunos', veryLogin, eAdmin, alunos)
router.get('/turmas', veryLogin, eAdmin, turmas)
router.get('/classes', veryLogin, eAdmin, classes)
router.get('/cursos', veryLogin, eAdmin, cursos)
router.get('/matricular', veryLogin, eAdmin, matricular)
router.get('/solicitacoes', veryLogin, eAdmin, solicitacoes)
router.get('/solicitacao/:idSolicitacao', veryLogin, eAdmin, solicitacao)
router.post('/autorizarJustific', veryLogin, eAdmin, autorizarJustific)
router.get('/pedidos', veryLogin, eAdmin, pedidos)
router.post('/atenderDec', veryLogin, eAdmin, atenderDec)
router.post('/declaracaoSemNota', veryLogin, eAdmin, declaracaoSemNota)

//router.get('/professores', professores)

export default router