import ejs from 'ejs'
import path from 'path'
import pdf from 'html-pdf'
import puppeteer from 'puppeteer'

import aluno from "../models/aluno.modell.js"
import { createAlunoService, findAlunoAnDeleteSercice, findAlunoByBIService, findAlunoByIdService } from "../services/aluno.service.js"
import { findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js"
import { findAllFuncionariosService } from "../services/funcionario.service.js"
import { findNotasDisciplinaByIdAluno, findNotasDisciplinaByIdAlunoAndDelete } from "../services/notasDisciplina.service.js"
import { findTurmaByCodigoServece, findTurmaByIdAndDeleteSerice, findTurmaByIdAndUpdService, findTurmaByIdCursoService, findTurmaByIdService } from "../services/turma.service.js"
import { createUserService, findAllUsers, findByUsernameService, findUserByIdAndDelet, findUserByIdService } from "../services/user.service.js"

export const admin = async (req, res) => {
    try {
        const id = req.params.id
        const user = await findUserByIdService(id)
        res.render('admin/admin', { user })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const editarFoto = async (req, res) => {
    try {
        res.send('Testar rota editar foto...')
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const addAluno = async (req, res) => {
    try {
        const idTurma = req.body.idTurma
        const numBI = req.body.numBI
        const classe = req.body.classe
        const nome = req.body.nome
        const curso = req.body.curso
        const idClasse = req.body.idClasse
        const idCurso = req.body.idCurso

        const turma = await findTurmaByIdService(idTurma)
        const anoActivo = await findAnoLectivoByEstadoService('Activo')
        const idAno = anoActivo._id
        
        //console.log(num)
        const nomeArray = nome.split(" ")
        const username0 = nomeArray[0]+'@ndunduma'+turma.codigo+'.'+nomeArray[1]
        const username = username0.toLocaleLowerCase()
        const senha = turma.codigo+'-'+nomeArray[1]
        
        //return res.send({senha})
        const novoUsuario = {
            username: username,
            senha: senha,
            categoria: 'aluno',
            telefone: ''
        }


        const aluno = {
            nome : nome,
            numBI : numBI,
            idTurma : idTurma,
            classe : classe,
            curso : curso,
            idClasse : idClasse,
            idCurso : idCurso,
            idAno : idAno,
            genero: 'Não definido',
            pai: 'Não definido',
            mae: 'Não definido',
            escolaAnt: 'Não definido',
            morada: 'Não definido',
            nomeEncarregado: 'Não definido',
            matricula: 'Confirmada',
        }
        const veryUser = await findByUsernameService(username)
        if(veryUser){
            //return res.send('Não foi possível adicionar aluno. Já ha um usuário com este nome!')
            req.flash('error_msg', 'Não foi possível adicionar aluno. Nome de usuário já existente! (Ao criar conta do aluno)')
            res.redirect('/turmas/turma/'+idTurma)
        }else{

            const userAluno = await createUserService(novoUsuario)
            aluno.usuario = userAluno._id;
            await createAlunoService(aluno)
            //return res.send('Sucesso!')
            
            req.flash('success_msg', 'Aluno adicionado com sucesso!')
            res.redirect('/turmas/turma/'+idTurma)
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const apagarAluno = async (req, res) => {

    try {
        const idAluno = req.params.id
        const aluno = await findAlunoByIdService(idAluno)
        //return res.send({aluno})
         res.render('admin/apagarAluno', {aluno})
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    } 
}
export const apagarAluno2 = async (req, res) => {

    try {
        const idAluno = req.body.idAluno
        const aluno = await findAlunoByIdService(idAluno)
        const usuario = await findUserByIdService(aluno.usuario)
        const idTurma = aluno.idTurma
        //const notasDisciplina = await findNotasDisciplinaByIdAluno(idAluno)
        await findNotasDisciplinaByIdAlunoAndDelete(idAluno)
        //return res.send({notasDisciplina})
        await findUserByIdAndDelet(aluno.usuario)
        await findAlunoAnDeleteSercice(idAluno)
        req.flash('error_msg', 'Dados do aluno apagado com sucesso')
         res.redirect('/turmas/turma/'+idTurma)
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    } 
}

export const eliminarTurma = async (req, res) => {
    try {
        const idTurma = req.body.idTurma

        await findTurmaByIdAndDeleteSerice(idTurma)

        req.flash('error_msg', 'Turma eliminada com exito!')
        res.redirect('/pedagogico/turmas')
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const editarTurma = async (req, res) => {
    try {
        const turma = req.body
        const turmas = await findTurmaByIdCursoService(turma.idCurso)

        let verTurma = ''
        turmas.forEach(t => {
            if(t.codigo == turma.codigo){
                verTurma = 'Neste curso, já existe uma turma com este código!'
            }
        });


        if(verTurma){
            //return res.send(verTurma)
            req.flash('error_msg', verTurma)
            res.redirect('/pedagogico/turmas')
            
        }else{
            //return res.send('Pode alterar...')
            const idTurma = req.body.idTurma
            const turmaAActualizar = await findTurmaByIdService(idTurma)
            turmaAActualizar.codigo = req.body.codigo
            //return res.send('Sucesso!')

            await findTurmaByIdAndUpdService(idTurma, turmaAActualizar)

            req.flash('success_msg', 'Código da Turma alterado com exito!')
            res.redirect('/pedagogico/turmas')
        }


    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const listaUserPDF = async (req, res) => {
    try {
        let usuarios = await findAllUsers()
        let funcionarios = await findAllFuncionariosService()

        funcionarios.forEach(funcionario => {
            usuarios.forEach(usuario => {
                if(funcionario.usuario == ''+usuario._id){
                    funcionario.usuario = usuario.username
                }
            });
        });

        const date = new Date();
        const diaR = date
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        
        
        
        //GERANDO PDF com puppeteer
        //const browser = await puppeteer.launch()
        return res.send('Sucesso! 1')
        const page = await browser.newPage()
        
        await page.goto('http://lrdd-cuito-2023.vercel.app', {
            waitUntil: 'networkidle0'
        })
        
        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            orientation: 'Landscape',
            margin: {
                top: '20px',
                bottom: '40px',
                left: '20px',
                right: '20px'
            }
        }).then(_=> {
            console.log('PDF Criado co sucesso!')
        }).catch(e => {
            console.log('Hoive um erro ao criar o PDF!:'+e)

        })
        
        await browser.close()
        res.contentType("application/pdf")

        return res.send(pdf)


        /* 
        //GERANDO PDF com html-pdf
       ejs.renderFile("./views/admin/listaUserPDF.ejs", { dia:dia, mes:mes, ano:ano, funcionarios }, (err, html) => {
        if (err) {
            return res.send('HOUVE UM ERRO!' + err)
        } else {

            const options = {
                format: "A4",
                orientation: 'portrait',
                header: {
                    height: "15mm"
                },
                footer: {
                    height: "20mm"
                }
                
            }
            pdf.create(html, options).toFile("./relatorios/listaUser.pdf", (err, re) => {
                if (err) {
                    return res.send('Um erro aconteceu ao guradar lista')
                } else {
                     req.flash('success_msg','Lista de usuarios gerado com sucesso! veja na pasta de relatórios em C:/')
                    res.redirect('/user/allUsers') 
                }
            })
        }
    })
    */

    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    } 
}

