import { Router } from "express";
import {turma, addTurma, gerirTurmas, tdTurmas, novaMatricula, saveNovaMatricula, turmaP, addProfessor, gerarLista, remProfessor, remProfessorSave, miniPauta, miniPautaPDF } from "../controlles/turma.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router();

router.post('/add', veryLogin, eAdmin, addTurma)
router.get('/', veryLogin, tdTurmas)
router.post('/gestao', veryLogin, gerirTurmas)
router.get('/pTurma/:id', veryLogin, turmaP)
router.get('/turma/:id', veryLogin, turma)
router.get('/minipauta/:id', veryLogin, miniPauta)
router.get('/miniPautaPDF/:id', veryLogin, miniPautaPDF)
router.get('/gerarLista/:id', veryLogin, gerarLista)
router.post('/novaMatricula', veryLogin, novaMatricula)
router.post('/saveNovaMatricula', veryLogin, saveNovaMatricula)
router.post('/addProfessor', veryLogin, addProfessor)
router.post('/remProfessor', veryLogin, remProfessor)
router.post('/remProfessorSave', veryLogin, remProfessorSave)


export default router;