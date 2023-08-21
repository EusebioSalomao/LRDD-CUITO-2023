import { createUserService, findAllUsers, findByUsernameService, findUserBIdAndUpdate, findUserBuNameService, findUserByIdAndDelet, findUserByIdService, generateToken } from "../services/user.service.js"
import { authMidleware } from '../middlewares/auth.middleware.js'
import passport from 'passport'
import { findAlunoByIdUser } from "../services/aluno.service.js";
import Cookies from "js-cookie";

export const allUsers = async (req, res) => {
    try {
        const usuarios = await findAllUsers();
        //return res.send({usuarios})
        if (!usuarios) {
            req.flash('error_messag', 'Não ha usuário registrado!')
            res.redirect('/')
        } else {
            res.render('admin/tdUsers', { usuarios })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const telaLogin = (req, res) => {
    res.render('admin/login')
}
export const login = async (req, res, next) => {
    try {
        const username = req.body.username;
        const user = await findUserBuNameService(username)
        // return res.send({user})

        if (user == null) {
            //return res.send('Usuario não achado!')
            req.flash('error_msg', 'Usuario ou senha invalido')
            res.redirect('/user/login')

        } else {
            const id = user._id
            const token = generateToken(user._id)
            return res.send({token})
            Cookies.set("token", token, {expires: 1})
            
            //return res.send('Usuario existente')
            if (user.eAdmin == 1) {
                await authMidleware(passport)
                passport.authenticate('local', {
                    successRedirect: '/admin/' + id,
                    failureRedirect: '/user/login',
                    failureFlash: true
                })(req, res, next)
            } else {
                if (user.categoria == 'professor') {
                    await authMidleware(passport)
                    passport.authenticate('local', {
                        successRedirect: '/professor/' + id,
                        failureRedirect: '/user/login',
                        failureFlash: true
                    })(req, res, next)
                } else {

                    if (user.categoria == 'aluno') {
                        const aluno = await findAlunoByIdUser(id)
                        const idAluno = aluno._id
                        //return res.send({aluno})
                        await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/alunos/ficha/' + idAluno,
                            failureRedirect: '/user/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    if (user.categoria == 'pedagogico') {
                        //return res.send('é pedagogico')
                        await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/pedagogico',
                            failureRedirect: '/user/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    if (user.categoria == 'financeiro') {
                        await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/financas/',
                            failureRedirect: '/user/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    if (user.categoria == 'secretario') {
                        await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/secretaria/',
                            failureRedirect: '/user/login',
                            failureFlash: true
                        })(req, res, next)
                    }
                    else {
                        // res.send('Usuario ou senha invalida')

                        /* await authMidleware(passport)
                        passport.authenticate('local', {
                            successRedirect: '/user/login',
                            failureRedirect: '/user/login',
                            failureFlash: true
                        })(req, res, next) */
                    }
                }

            }

        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        req.flash('success_msg', 'Sua sessão foi encerrada!')
        res.redirect('/')

    })
}

export const wAddUser = (req, res) => {
    res.render('admin/addUser')
}
export const addUser = async (req, res) => {
    try {
        if (req.file) {
            //return res.send('Sucesso')
            const usuario = req.body.username
            const senha = req.body.senha;
            const telefone = req.body.telefone;
            let categoria = req.body.categoria;
            if (req.body.categoria === 'Selecionar') {
                categoria = 'Aluno'
            }
            const verifyUser = await findByUsernameService(usuario)
            if (verifyUser) {
                req.flash('error_msg', 'Nome de usuário já existente!')
                res.redirect('/user/add')
            } else {
                const novoUsuario = {
                    username: usuario,
                    senha: senha,
                    telefone: telefone,
                    categoria: categoria,
                    foto: req.file.filename
                }

                //return res.send({novoUsuario})
                switch (categoria) {
                    case "admin":
                        novoUsuario.eAdmin = 1
                        break;

                    case "secretario":
                        novoUsuario.eAdmin = 2
                        break;

                    case "pedagogico":
                        novoUsuario.eAdmin = 3
                        break;

                    case "financeiro":
                        novoUsuario.eAdmin = 4
                        break;

                    default:
                        break;
                }

                console.log(novoUsuario)
                await createUserService(novoUsuario);
                req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                res.redirect('/user/allUsers')
            }

        } else {

            return res.send('Falha ao carregar foto')
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const deletUser = async (req, res) => {
    try {
        const id = req.params.id
        const usuario = await findUserByIdAndDelet(id)
        if (!usuario) {
            req.flash('error_msg', 'Voce está tentar apagar usuário não existente')
            res.redirect('/user/allUsers')
        } else {
            req.flash('error_msg', 'Usuário xcluido com sucesso')
            res.redirect('/user/allUsers')
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const wEditUser = async (req, res) => {
    try {
        const id = req.params.id
        const usuario = await findUserByIdService(id)
        if (!usuario) {
            req.flash('error_msg', 'Voce está tentar actualizar usuário não existente')
            res.redirect('/user/allUsers')
        } else {
            res.render('admin/editUser', { usuario })
        }
    } catch (error) {
        res.status(500).send({ msg: error.mesage })
    }
}

export const editUser = async (req, res) => {
    try {
        const id = req.body.id
        const username = req.body.username
        const telefone = req.body.telefone
        if (username == '' || username.length < 2) {
            req.flash('error_msg', 'Nome de usuário invalido')
            res.redirect('/user/editUser/' + id)
        } else {
            const usuario = await findUserByIdService(id)
            if (!usuario) {
                req.flash('error_msg', 'Este usuário não existe!')
                res.redirect('/user/allUsers')
            } else {
                usuario.username = username
                usuario.telefone = telefone
                await findUserBIdAndUpdate(id, usuario);
                req.flash('success_msg', 'Dados do usuário alterado com sucesso!')
                res.redirect('/user/allUsers')

            }
        }
    } catch (error) {
        res.status(500).send({ mesag: error.mesage })
    }
}

export const perfil = async (req, res) => {
    try {
        const userLog = req.user
        const username = userLog.username;
        const user = await findUserBuNameService(username)
        const id = user._id
        // return res.send({user})

        if (user == '') {
            return res.send('Usuario não achado!')

        } else {
            //return res.send('Usuario existente')
            if (user.eAdmin == 1) {
                //return res.send('Usuario Admin')

                res.redirect('/admin/' + id)

            } else {
                if (user.categoria == 'professor') {
                    res.redirect('/professor/' + id)
                } else {

                    if (user.categoria == 'aluno') {
                        const aluno = await findAlunoByIdUser(id)
                        const idAluno = aluno._id
                        //return res.send({aluno})
                        res.redirect('/alunos/ficha/' + idAluno)
                    }
                    if (user.categoria == 'pedagogico') {
                        res.redirect('/pedagogico/')
                    }
                }
                /*  else {
                    await authMidleware(passport)
                    passport.authenticate('local', {
                        successRedirect: '/inicio',
                        failureRedirect: '/user/login',
                        failureFlash: true
                    })(req, res, next)
                } */

            }


        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}