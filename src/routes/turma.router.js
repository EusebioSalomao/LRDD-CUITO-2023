import { Router } from "express";
import {turma, addTurma, gerirTurmas, tdTurmas, novaMatricula, saveNovaMatricula, turmaP, addProfessor } from "../controlles/turma.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router();

router.post('/add', eAdmin, veryLogin, addTurma)
router.get('/', veryLogin, tdTurmas)
router.post('/gestao', veryLogin, gerirTurmas)
router.get('/pTurma/:id', veryLogin, turmaP)
router.get('/turma/:id', veryLogin, turma)
router.post('/novaMatricula', veryLogin, novaMatricula)
router.post('/saveNovaMatricula', veryLogin, saveNovaMatricula)
router.post('/addProfessor', veryLogin, addProfessor)

export default router;