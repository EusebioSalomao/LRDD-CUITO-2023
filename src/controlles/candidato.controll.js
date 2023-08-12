import mongoose from "mongoose";
import { findAllCandidatosService, findCandByIdAndDeleteService, findCandByIdAndUpdateService, findCandByIdService, findCandByNumBIService, saveCandidatoService, updateCandService } from "../services/candidato.service.js";
import { findAllCursosService, findCursoByDescricaoService, findCursoByIdAndUpdateService, findCursosByIdAnoService } from "../services/curso.service.js";
import { findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js";
import { addReceitaService } from "../services/financas.service.js";


//Listar candidatos
export const allCandidatos = async (req, res) => {
    try {
        const candidatosInscrito = []
        const solcitCandidatura = []
        const candidatos = await findAllCandidatosService()
        candidatos.forEach(candidato => {
            if(candidato.estado == 'Inscrito' || candidato.estado == 'Admitido'){
                candidatosInscrito.push(candidato)
            }
            if(candidato.estado == 'Pendente'){
                solcitCandidatura.push(candidato)
            }

        });
        res.render('alunos/candidatos', { candidatosInscrito, solcitCandidatura })
    } catch (error) {
        res.status(500).send({ mesage: 'Erro ao listar Candidatos: ' + error.mesage })
    }
}

export const solicitacoes = async (req, res) => {
    try {
        const solcitCandidatura = []
        const candidatos = await findAllCandidatosService()
        candidatos.forEach(candidato => {
            if(candidato.estado == 'Pendente'){
                solcitCandidatura.push(candidato)
            }

        });
        res.render('alunos/solicitarCand', { solcitCandidatura })
    } catch (error) {
        res.status(500).send({ mesage: 'Erro ao listar Candidatos: ' + error.mesage })
    }
}

export const wCandidato = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoActivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoActivo._id
        const cursos = await findCursosByIdAnoService(idAno)
        res.render('alunos/addCandidato', { cursos })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const addCandCont = async (req, res) => {
    try {
        const candidato = req.body;
        const erros = []
        if (req.body.genero == 'selecionar') {
            erros.push({ texto: 'Seleciona o género' })
        }
        if (req.body.curso == 'selecionar') {
            erros.push({ texto: 'Seleciona o curso' })
        }
        if (erros.length > 0) {
            const cursos = await findAllCursosService()
            res.render('alunos/reAddCandidato', { candidato, cursos, erros })
        }
        else {

            const cursos = await findAllCursosService()
            res.render('alunos/addCandCont', { candidato, cursos })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}


export const saveCandidato = async (req, res) => {
    try {
        if(req.file){
           // return res.send("Sucesso"+req.file.filename)
            //Validar mais os campos
        const numBi = req.body.numBI
        const sizeBI = numBi.length
        const existCandidato = await findCandByNumBIService(numBi)
        const candidato = req.body;
        candidato.foto = req.file.filename
        //return res.send({candidato})
        const data = req.body.dataNascimento
        const anoString = data.slice(0, 4)
        const anoInt = parseInt(anoString)
        const dataActual = new Date().getFullYear()
        

        const idade =  dataActual - anoInt
        //return res.send({idade})
        const erro = []
        if (idade < 14) {
            erro.push({ texto: 'Idade não permitida para ingressar em nossa instituição' })
            //res.render('alunos/addCandCont', { candidato, erro })
        }
        if (existCandidato) {
            erro.push({ texto: 'Já existe um registro com este BI' })
            //res.render('alunos/addCandCont', { candidato, erro })
        }
        if (sizeBI != 14) {
            erro.push({ texto: 'Número do Bilhete invalido' })
        }
        if (erro.length > 0) {
            res.render('alunos/addCandCont', { candidato, erro })

        } else {
            const user = req.user
            if(user){
                //return res.send('Está logado!')
                candidato.idade = idade
                const novoCand = await saveCandidatoService(candidato)
                req.flash('success_msg', 'Candidatura adicionada com sucesso')
                const valorR = 200
                const novaReceita = {
                    descricao: 'Inscrição de Candidato',
                    qt: 1,
                    valor: valorR,
                   // funcionario: 'secretario'
                }
                await addReceitaService(novaReceita)
                res.redirect('/')
            }else{
                //return res.send('não está logado!')
                const estado = 'Pendente'
                candidato.idade = idade
                candidato.estado = estado
                const novoCand = await saveCandidatoService(candidato)
                req.flash('success_msg', 'Candidatura enviada com sucesso!')
                res.redirect('/')

            }
        }


    }else{

        return res.send("Erro upload file!")
    }
        
    } catch (error) {
        res.status(500).send({ mesag: error.mesage })
    }
}

export const wDetalheCand = async (req, res) => {
    try {
        const id = req.params.id
        const candidato = await findCandByIdService(id)
        res.render('alunos/detalheCand', { candidato })
    } catch (error) {
        res.status(500).send({ mesag: error.mesage })
    }
}

export const wEdidarCand = async (req, res) => {
    try {
        const id = req.params.id
        const candidato = await findCandByIdService(id)
        res.render('alunos/editCand', { candidato })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const saveEdidarCand = async (req, res) => {
    try {
        const id = req.body.id
        const idd = mongoose.Types.ObjectId(id)
        const erros = []
        if (req.body.genero === 'selecionar') {
            erros.push({ texto: 'Seleciona o genero!' })
        }
        if (req.body.curso === 'selecionar') {
            erros.push({ texto: 'Seleciona o curso!' })
        }
        if (erros.length > 0) {
            const candidato = await findCandByIdService(id)
           
            res.render('alunos/editCand', { candidato, erros })
        } else {

            //Restrições para o BI
            const verifyBI = await findCandByNumBIService(req.body.numBI)

            if (verifyBI === null) {
                const updatCand = req.body
                await updateCandService(id, updatCand)
                res.redirect('/candidatos')
            } else {
                const iddd = verifyBI._id;
                if (verifyBI._id == req.body.id) {
                    const updatCand = req.body
                    await updateCandService(id, updatCand)
                    res.redirect('/candidatos')

                } else {
                    console.log(iddd, idd)
                    res.send('Este BI já está regirtrado em nossa!')
                }
            }
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const deleteCand = async (req, res) => {
    try {
        const id = req.params.id
        await findCandByIdAndDeleteService(id)
        res.redirect('/candidatos')

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const consultCand = async (req, res) => {
    try {
        const bi = req.body.bi
        const candConsulta = await findCandByNumBIService(bi)
        if(candConsulta == null){
            req.flash('error_msg', 'Dados não encontrado! Certifique de que fez inscrição. Ou sua candidatura não foi validada')
            res.redirect('/')
        }else{

            const candidatos = await findAllCandidatosService()
            res.render('alunos/consulta', { candConsulta, candidatos })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const admitiCand = async (req, res) => {
    try {
        const id = req.body.id
        const candidato = await findCandByIdService(id)
        const descricao = candidato.curso;
        const curso = await findCursoByDescricaoService(descricao)
        if (candidato.estado != 'Inscrito') {
            req.flash('error_msg', 'Este candidato já está Admitido ')
            res.redirect('/candidatos')
        } else {
            if (curso.numVagas == 0) {
                req.flash('error_msg', 'Vaga esgotada para ' + descricao + '!')
                res.redirect('/candidatos')
            } else {
                req.flash('success_msg', 'Candidato admitido com sucesso!')
                candidato.estado = 'Admitido';
                await findCandByIdAndUpdateService(id, candidato)
                curso.numVagas -= 1
                const idCurso = curso._id
                await findCursoByIdAndUpdateService(idCurso, curso)
                res.redirect('/candidatos')
            }
        }

    } catch (error) {
        res.status(500).send({ ms: error.mesage })
    }
}

export const aceitarCand = async (req, res) => {
    try {
        const id = req.body.id
        const candidato = await findCandByIdService(id)
        
        candidato.estado = 'Inscrito'
        const valorR = 200
        //return res.send('teste')
        const novaReceita = {
            descricao: 'Inscrição de Candidato',
            qt: 1,
            valor: valorR,
            // funcionario: 'secretario'
        }
        const recCreada = await addReceitaService(novaReceita)
        await findCandByIdAndUpdateService(id, candidato)

        req.flash('success_msg', 'Candidatura aceite')
        res.redirect('/candidatos/solicitacoes')
        

    } catch (error) {
        res.status(500).send({ ms: error.mesage })
    }
}