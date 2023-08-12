import { Router } from "express"; 
import { addClasse } from "../controlles/classe.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.post('/add', eAdmin, veryLogin, addClasse)

export default router