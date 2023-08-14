import { Router } from "express";
import { addAluno, admin, editarFoto } from "../controlles/admin.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/:id', eAdmin, veryLogin, admin)
router.post('/editFoto', veryLogin, editarFoto)
router.post('/addAluno', eAdmin, addAluno)

export default router