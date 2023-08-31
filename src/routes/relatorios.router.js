import { Router } from "express";
import { gerarListaAlunos, pautaFinal, pautaTrimestral, pautaTrimestralII, pautaTrimestralIII, relFDiario } from "../controlles/relatorios.controll.js";
const router = Router()

router.get('/pautaTrimestral/:id', pautaTrimestral)
router.get('/pautaTrimestralII/:id', pautaTrimestralII)
router.get('/pautaTrimestralIII/:id', pautaTrimestralIII)
router.get('/pautaFinal/:id', pautaFinal)
router.get('/relFDiario', relFDiario)
router.get('/gerarListaAlunos/:id', gerarListaAlunos)



export default router