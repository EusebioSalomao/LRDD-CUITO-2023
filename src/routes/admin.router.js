import { Router } from "express";
import { admin, editarFoto } from "../controlles/admin.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/:id', eAdmin, veryLogin, admin)
router.post('/editFoto', veryLogin, editarFoto)

export default router