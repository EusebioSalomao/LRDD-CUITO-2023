import { Router } from "express";
import { definicoes } from "../controlles/definicao.controll.js";
import { eAdmin, veryLogin } from "../../helpers/eAdmin.js";
const router = Router()

router.get('/', eAdmin, veryLogin, definicoes)


export default router