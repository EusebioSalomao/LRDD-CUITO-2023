//Para restringir acesso
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { findUserByIdService } from '../src/services/user.service.js';
dotenv.config()

export const eAdmin = (req, res, next) => {
   if(req.user){
    if(req.user.eAdmin == 1) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
   }else{

       req.flash('error_msg', 'Acesso não autorizado!')
       res.redirect('/')
    }
}
export const eSecret = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 2) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}
export const eSecretP = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 3) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}
export const eFinanc = (req, res, next) => {
    if (req.isAuthenticated() && req.user.eAdmin == 1 || req.user.eAdmin == 4) {
        return next();
    }
    req.flash('error_msg', 'Acesso não autorizado!')
    res.redirect('/')
}

export const veryLogin = async (req, res, next) => {
    try {
        
        const authorization = 'Bear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZGM0ZGI2MDRiY2QwODc2YjhlM2Y2YyIsImlhdCI6MTY5MjY0NTg1OCwiZXhwIjoxNjkyNzMyMjU4fQ.-v1o5HkhhRXTR75DH57jiKXJZasLjKmgndFX9vSXwNQ'
        if(!authorization){
            return res.status(401).send('Acesso negado!')
        }
        const parts = authorization.split(" ")
        if(parts.length !== 2){
            return res.status(401).send('Acesso negado! <br> O tokem so pode ter duas palabras!: Bear Token')
        }
        const [schema, token] = parts;
        if(schema !== 'Bear'){
            return res.status(401).send('Acesso negado! <br> A primeira palavra deve ser Bear!: Bear Token')
        }

        //Validando o token com jesonwebtoken
        jwt.verify(token, process.env.SECRET_JWT, async (erro, decoded) => {
            if(erro){
            return res.status(401).send('Acesso negado! <br> Token invalido')
            }
            const user = await findUserByIdService(decoded.id);
            if(!user){
            return res.status(401).send('Usuario não existente!')
            }
            req.userId = user._id;
            req.user = user
            return next()
        })
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}
