import { Router } from "express";
import {turma, addTurma, gerirTurmas, tdTurmas, novaMatricula, saveNovaMatricula, turmaP, addProfessor, gerarLista, remProfessor, remProfessorSave, miniPauta, miniPautaPDF } from "../controlles/turma.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router();

router.post('/add', veryLogin, eAdmin, addTurma)
router.get('/', veryLogin, tdTurmas)
router.post('/gestao', veryLogin, eAdmin, gerirTurmas)
router.get('/pTurma/:id', veryLogin, turmaP)
router.get('/turma/:id', veryLogin, eAdmin, turma)
router.get('/minipauta/:id', veryLogin, eAdmin, miniPauta)
router.get('/miniPautaPDF/:id', veryLogin, miniPautaPDF)
router.get('/gerarLista/:id', veryLogin, gerarLista)
router.post('/novaMatricula', veryLogin, eAdmin, novaMatricula)
router.post('/saveNovaMatricula', veryLogin, eAdmin, saveNovaMatricula)
router.post('/addProfessor', veryLogin, eAdmin, addProfessor)
router.post('/remProfessor', veryLogin, eAdmin, remProfessor)
router.post('/remProfessorSave', veryLogin, eAdmin, remProfessorSave)


export default router;