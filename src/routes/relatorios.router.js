import { Router } from "express";
import { gerarListaAlunos, pautaFinal, pautaTrimestral, pautaTrimestralII, pautaTrimestralIII, relFDiario } from "../controlles/relatorios.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/pautaTrimestral/:id', veryLogin, eAdmin, pautaTrimestral)
router.get('/pautaTrimestralII/:id', veryLogin, eAdmin, pautaTrimestralII)
router.get('/pautaTrimestralIII/:id', veryLogin, eAdmin, pautaTrimestralIII)
router.get('/pautaFinal/:id', veryLogin, eAdmin, pautaFinal)
router.get('/relFDiario', veryLogin, eAdmin, relFDiario)
router.get('/gerarListaAlunos/:id', veryLogin, eAdmin, gerarListaAlunos)



export default router