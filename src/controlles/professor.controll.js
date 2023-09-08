import { calcularMedias } from "../middlewares/professor.middlewere.js"
import disciplina from "../models/disciplina.modell.js"
import { findAlunoByNumBIService, findAlunosByIdTurma } from "../services/aluno.service.js"
import { findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js"
import { findAllDiscplinasService, findDisciplinaByIdTurmaService } from "../services/disciplina.service.js"
import { createFaltaService, findAllFaltasService, findFaltaBayIdAlunoService, findFaltaByIdAndUpdateService, findFaltaByIdService } from "../services/faltas.service.js"
import { findAllFuncionariosService, findFuncionariosByIdService, findFuncionariosUser } from "../services/funcionario.service.js"
import { findMinipautaByIdService, findMinipautasByIdProfessorService } from "../services/minipauta.service.js"
import { createNotaTrimestral, findAllNotasTrimSercice, findNotaByIdAndUpdateSerice, findNotasExistentByIdService } from "../services/notas.service.js"
import { createNotasDisciplinaService, findNotasDisciplinaByIdAluno, findNotasDisciplinaByIdMinipautaService } from "../services/notasDisciplina.service.js"
import { findOcorrenciaByEstatoService, findOcorrenciaByIdAndUpdateServece, findSolicitacaoByIdService } from "../services/ocorrencias.service.js"
import { findAllTurmasService } from "../services/turma.service.js"
import { findUserByIdService } from "../services/user.service.js"
import { solicitacao } from "./pedagogico.controll.js"

export const professor = async (req, res) => {
    try {
        const user = req.user
        if(!user){
            req.flash('error_msg','Faça login no seu perfil')
            res.redirect('/user/login')
        }else{
        /* const id = req.params.id
        const usuario = await findUserByIdService(id)
        const idUser = usuario._id
        const professor = await findFuncionariosUser(idUser) */

        const usuario = user._id
            const professor = await findFuncionariosUser(usuario)
           // return res.send({professor})
            const estado = 'Activo'
            const anoLectivoActivo = await findAnoLectivoByEstadoService(estado)
            const idAno = anoLectivoActivo._id
            const estadoSolicitacao = 'Pendente'
            const tdOcorrencias = await findOcorrenciaByEstatoService(estadoSolicitacao)
            const ocorrencias = []
            tdOcorrencias.forEach(ocorrencia => {
                professor.turmas.forEach(turma => {
                    if(turma == ocorrencia.turma){
                        ocorrencias.push(ocorrencia)
                    }
                });
            });

        res.render('professor/professor', { professor, ocorrencias })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const turmasDoProf = async (req, res) => {
    try {
        const id = req.params.id
        const professor = await findFuncionariosByIdService(id)
        const idTurmas = professor.turmas
        const tdTurmas = await findAllTurmasService()

        const turmas = []
        professor.turmas.forEach(turmP => {
            tdTurmas.forEach(turma => {
                if (turma._id == turmP) {
                    turma.idProfessor = id
                    turmas.push(turma)
                }
            });
        });

        //return res.send({turmas})
        res.render('professor/gerirTurmas', { professor, turmas })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const listaAlunos = async (req, res) => {
    try {
        const idTurma = req.params.id
        const professores = await findAllFuncionariosService()
        let idProfessor = 0

        
        const alunos = await findAlunosByIdTurma(idTurma)
        const faltas = await findAllFaltasService()
       // return res.send({faltas})
        professores.forEach(professor => {
            professor.turmas.forEach(turma => {
                let numF = 0
                alunos.forEach(aluno => {
                    /* faltas.forEach(fal => {
                        console.log(fal.aluno)
                        if (fal.aluno == aluno._id) {
                            numF += 1
                        }
                        aluno.faltas = numF
                    }); */
                    if (turma == idTurma) {
                        idProfessor = professor._id
                        aluno.idProfessor = idProfessor
                    }
                });
            });
        });
        const disciplinas = await findMinipautasByIdProfessorService(idProfessor)
        let nomeDisciplina = ''
        disciplinas.forEach(element => {
            if (element.idTurma._id == idTurma) {
                nomeDisciplina = element.nomeDisciplina
            }
        });

        /* Tentando contar faltas */
       /*  faltas.forEach(f => {
        alunos.forEach(aluno => {
                let idP = 0
                idP = f.professor
                if(f.aluno == aluno._id){
                    console.log('Testou')
                    if(f.aluno === aluno._id){
                    }
                    console.log(typeof aluno._id)
                    aluno.faltas = f.faltas.length
                }
            });
        }); */
         //return res.send({ nomeDisciplina })
        res.render('professor/listaAlunos', { alunos })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const miniPautas = async (req, res) => {
    try {
        const id = req.params.id
        const professor = await findFuncionariosByIdService(id)
        const idTurmas = professor.turmas
        const idProfessor = id
        const minipautas = await findMinipautasByIdProfessorService(idProfessor)


        res.render('professor/minipautas', { professor, minipautas })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const miniPauta = async (req, res) => {
    try {
        const user = req.user
        let lancarNota = ''
        const id = req.params.id
        const minipauta = await findMinipautaByIdService(id)
        const idTurmas = professor.turmas
        const tdTurmas = await findAllTurmasService()
        const idTurma = minipauta.idTurma._id
        const alunosTurma = await findAlunosByIdTurma(idTurma)
        //const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(id)
        const usuario = minipauta.idProfessor.usuario

        /* PARA ADICIONAR ALUNO NA MINIPAUTA */
        const VeryNotasDisciplina = await findNotasDisciplinaByIdMinipautaService(id)
        alunosTurma.forEach( async aluno => {
            let achado = ''
            VeryNotasDisciplina.forEach( notaD  => {
                if(notaD.aluno._id == ''+aluno._id){
                    achado = 'Achado!'
                }
            });
            if(achado){
                console.log(achado)
            }else{
                console.log('Não achado...')
                //console.log('Não Achado')
                    let novaNotasDoaluno = {
                        aluno: aluno._id,
                        professor: minipauta.idProfessor,
                        idMinipauta: minipauta._id,
                        idClasse: minipauta.idClasse,
                        idTurma: minipauta.idTurma
                    }
                    let notaTrimestral = {}
                    const notasTrimCread = await createNotaTrimestral(notaTrimestral)
                    novaNotasDoaluno.notas = notasTrimCread._id
                    const notasDoAlunoCriada = await createNotasDisciplinaService(novaNotasDoaluno)
                    console.log({notasDoAlunoCriada})
                    /* 
                */
            }
        });
        const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(id)
        //return res.send(notasDisciplina)
        
        /* Numerar */
        let numeroOrd = 1
        notasDisciplina.forEach(aluno => {
            aluno.numeroOrd = numeroOrd++
        });
        

        if (user) {

            if (user._id == usuario) {
                lancarNota = 'Autorisado'
            }
        }



        res.render('professor/minipauta', { minipauta, alunosTurma, notasDisciplina, lancarNota })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const lancarNota = async (req, res) => {
    try {
        const idAluno = req.body.aluno
        const idProfessor = req.body.idProfessor
        const idMinipauta = req.body.idMinipauta
        const idClasse = req.body.idClasse
        const idTurma = req.body.idTurma

        const trimeste = req.body.trimestre
        const notaDe = req.body.notaDe
        const notaString = req.body.nota
        let nota = parseInt(notaString)

        const notasDisciplina = await findNotasDisciplinaByIdMinipautaService(idMinipauta)
        const notasDoAluno = await findNotasDisciplinaByIdAluno(idAluno)
        let verifNota = ''
        let notasAchada = ''
        //return res.send({notasDoAluno})
        notasDoAluno.forEach(element => {
            if (element.idMinipauta == idMinipauta) {
                verifNota = 'Ja'
                notasAchada = element.notas
            }
        });


        //const xxx = await createNotaTrimestral(testNotas)

        //const verNotasTrim = await findAllNotasTrimSercice()
        if (verifNota == '') {
            //return res.send("O aluno ainda não tem notas nesta discplina")
            let novaNotasDoaluno = {
                aluno: idAluno,
                professor: idProfessor,
                idMinipauta: idMinipauta,
                idClasse: idClasse,
                idTurma: idTurma
            }
            let notaTrimestral = {}
            if (trimeste == 'primeiro') {
                switch (notaDe) {
                    case "avaliacao1":
                        //return res.send("Lançar nota no primeiro trimestre - av1")
                        notaTrimestral.av1T1 = nota
                        break;
                    case "avaliacao2":
                        // return res.send("Lançar nota no primeiro trimestre - av2")
                        notaTrimestral.av2T1 = nota

                        break;
                    case "avaliacao3":
                        //   return res.send("Lançar nota no primeiro trimestre - av3")
                        notaTrimestral.av3T1 = nota

                        break;
                    case "provaDoProfessor":
                        //   return res.send("Lançar nota no primeiro trimestre - av3")
                        notaTrimestral.pp1 = nota

                        break;
                    case "provaDoTrimestre":
                        //   return res.send("Lançar nota no primeiro trimestre - av3")
                        notaTrimestral.pt1 = nota

                        break;

                    default:
                        return res.send('Selecione os campos correctamente!')
                        break;
                }
            }
            if (trimeste == 'segundo') {
                switch (notaDe) {
                    case "avaliacao1":
                        //return res.send("Lançar nota no segungo trimestre - av1")
                        notaTrimestral.av1T2 = nota
                        break;
                    case "avaliacao2":
                        // return res.send("Lançar nota no segungo trimestre - av2")
                        notaTrimestral.av2T2 = nota

                        break;
                    case "avaliacao3":
                        //   return res.send("Lançar nota no segungo trimestre - av3")
                        notaTrimestral.av3T2 = nota

                        break;
                    case "provaDoProfessor":
                        //   return res.send("Lançar nota no segungo trimestre - av3")
                        notaTrimestral.pp2 = nota

                        break;
                    case "provaDoTrimestre":
                        //   return res.send("Lançar nota no segungo trimestre - av3")
                        notaTrimestral.pt2 = nota

                        break;

                    default:
                        return res.send('Selecione os campos correctamente!')

                        break;
                }
            }
            if (trimeste == 'terceiro') {
                switch (notaDe) {
                    case "avaliacao1":
                        //return res.send("Lançar nota no terceiro trimestre - av1")
                        notaTrimestral.av1T3 = nota
                        break;
                    case "avaliacao2":
                        // return res.send("Lançar nota no terceiro trimestre - av2")
                        notaTrimestral.av2T3 = nota

                        break;
                    case "avaliacao3":
                        //   return res.send("Lançar nota no terceiro trimestre - av3")
                        notaTrimestral.av3T3 = nota

                        break;
                    case "provaDoProfessor":
                        //   return res.send("Lançar nota no terceiro trimestre - av3")
                        notaTrimestral.pp3 = nota

                        break;
                    case "provaDoTrimestre":
                        //   return res.send("Lançar nota no terceiro trimestre - av3")
                        notaTrimestral.pt3 = nota

                        break;

                    default:
                        return res.send('Selecione os campos correctamente!')

                        break;
                }
            }
            if (trimeste == 'outro') {
                switch (notaDe) {
                    case "provaOral":
                        //return res.send("Lançar nota de prova oral, final ou exame")
                        notaTrimestral.pOral = nota
                        break;
                    case "exame":
                        // return res.send("Lançar nota de prova oral, final ou exame")
                        notaTrimestral.examePF = nota

                        break;

                    default:
                        return res.send('Selecione os campos correctamente!')

                        break;
                }
            }
            const notasTrimCread = await createNotaTrimestral(notaTrimestral)
            novaNotasDoaluno.notas = notasTrimCread._id
            const notasDoAlunoCriada = await createNotasDisciplinaService(novaNotasDoaluno)
            //return res.send({ notasDoAlunoCriada })
            req.flash('success_msg', 'Nota lançada com exito!')
            res.redirect("/professor/minipauta/" + idMinipauta)
        } else {
            const idNotaAch = notasAchada._id
            const notasExist = await findNotasExistentByIdService(idNotaAch)
            if (notasExist) {
                //return res.send('Actualizar as notas do auno!')
                if (trimeste == 'primeiro') {
                    switch (notaDe) {
                        case "avaliacao1":
                            //return res.send("Lançar nota no primeiro trimestre - av1")
                            notasExist.av1T1 = nota
                            break;
                        case "avaliacao2":
                            // return res.send("Lançar nota no primeiro trimestre - av2")
                            notasExist.av2T1 = nota

                            break;
                        case "avaliacao3":
                            //   return res.send("Lançar nota no primeiro trimestre - av3")
                            notasExist.av3T1 = nota

                            break;
                        case "provaDoProfessor":
                            //   return res.send("Lançar nota no primeiro trimestre - av3")
                            notasExist.pp1 = nota

                            break;
                        case "provaDoTrimestre":
                            //   return res.send("Lançar nota no primeiro trimestre - av3")
                            notasExist.pt1 = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')
                            break;
                    }
                }
                if (trimeste == 'segundo') {
                    switch (notaDe) {
                        case "avaliacao1":
                            //return res.send("Lançar nota no segungo trimestre - av1")
                            notasExist.av1T2 = nota
                            break;
                        case "avaliacao2":
                            // return res.send("Lançar nota no segungo trimestre - av2")
                            notasExist.av2T2 = nota

                            break;
                        case "avaliacao3":
                            //   return res.send("Lançar nota no segungo trimestre - av3")
                            notasExist.av3T2 = nota

                            break;
                        case "provaDoProfessor":
                            //   return res.send("Lançar nota no segungo trimestre - av3")
                            notasExist.pp2 = nota

                            break;
                        case "provaDoTrimestre":
                            //   return res.send("Lançar nota no segungo trimestre - av3")
                            notasExist.pt2 = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')

                            break;
                    }
                }
                if (trimeste == 'terceiro') {
                    switch (notaDe) {
                        case "avaliacao1":
                            //return res.send("Lançar nota no terceiro trimestre - av1")
                            notasExist.av1T3 = nota
                            break;
                        case "avaliacao2":
                            // return res.send("Lançar nota no terceiro trimestre - av2")
                            notasExist.av2T3 = nota

                            break;
                        case "avaliacao3":
                            //   return res.send("Lançar nota no terceiro trimestre - av3")
                            notasExist.av3T3 = nota

                            break;
                        case "provaDoProfessor":
                            //   return res.send("Lançar nota no terceiro trimestre - av3")
                            notasExist.pp3 = nota

                            break;
                        case "provaDoTrimestre":
                            //   return res.send("Lançar nota no terceiro trimestre - av3")
                            notasExist.pt3 = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')

                            break;
                    }
                }
                if (trimeste == 'outro') {
                    switch (notaDe) {
                        case "provaOral":
                            //return res.send("Lançar nota de prova oral, final ou exame")
                            notasExist.pOral = nota
                            break;
                        case "exame":
                            // return res.send("Lançar nota de prova oral, final ou exame")
                            notasExist.examePF = nota

                            break;

                        default:
                            return res.send('Selecione os campos correctamente!')

                            break;
                    }
                }

                //CÁLCULOS DAS MÉDIAS - MAC MT1, MT2, MT3, MT, CF


                //return res.send('Actualozação das notas do aluno')
                const notasUpdate = await findNotaByIdAndUpdateSerice(idNotaAch, notasExist)
                const mediasActulizadas = await calcularMedias(idNotaAch)
                // return res.send({mediasActulizadas})
                req.flash('success_msg', 'Nota lançada com exito!')
                res.redirect("/professor/minipauta/" + idMinipauta)
            } else {
                return res.send('As notas do aluno foram apagadas do sistea')

            }
        }

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const config = async (req, res) => {
    try {
        res.send("Testar config...")
    } catch (error) {

    }
}

export const aplicarFalta = async (req, res) => {
    try {
        const user = req.user
        const prof = await findFuncionariosUser(user._id)
        const idProfessor = prof._id
        const idAluno = req.body.idAluno
        const idTurma = req.body.idTurma
        const disciplinas = await findMinipautasByIdProfessorService(idProfessor)
        const disciplina = []
        let nomeDisciplina = ''
        disciplinas.forEach(element => {
            if (element.idTurma._id == idTurma ) {
                
                nomeDisciplina = element.nomeDisciplina
            }
        });
        //return res.send({nomeDisciplina})
        let eProfDaD = ''
        
        const verifFaltas = await findFaltaBayIdAlunoService(idAluno)
        
        const falta = {
            dataFalfa: Date.now(),
            numFalta: 1
        }
        const faltaNova = {
            disciplina: nomeDisciplina,
            professor: idProfessor,
            aluno: idAluno,
            faltas: falta
        }
        // return res.send({ faltaNova })
        if (!verifFaltas) {
            //return res.send('Vai criar, verificando')
            const novaFalta = await createFaltaService(faltaNova)
            //return res.send('Vai actualizar, verificando')
        } else {
            //return res.send("Testar...")
            let eMesmoProf = ''
            let idFalta = ''
            verifFaltas.forEach(element => {
                if (element.disciplina == nomeDisciplina) {
                    eMesmoProf = 'Sim'
                    console.log('É mesmo professor')
                    idFalta = element._id
                }
            });
             if (eMesmoProf){
                const faltaAchada = await findFaltaByIdService(idFalta)
                faltaAchada.faltas.push(falta)
                const faltaUp = await findFaltaByIdAndUpdateService(idFalta, faltaAchada)
                req.flash('error_msg', 'Falta marcada!')
                res.redirect("/professor/listaAlunos/" + idTurma)
            } else {
                //return res.send({faltaNova})
                const novaFalta = await createFaltaService(faltaNova)
                req.flash('error_msg', 'Falta marcada!')
                res.redirect("/professor/listaAlunos/" + idTurma)
            } 


        }


    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const solicitacoesProf = async (req, res) => {
    try {
        const user = req.user
        if(!user){
            req.flash('error_msg','Faça login no seu perfil')
            res.redirect('/user/login')
        }else{
            const usuario = user._id
            const professor = await findFuncionariosUser(usuario)
           // return res.send({professor})
            const estado = 'Activo'
            const anoLectivoActivo = await findAnoLectivoByEstadoService(estado)
            const idAno = anoLectivoActivo._id
            const estadoSolicitacao = 'Pendente'
            const tdOcorrencias = await findOcorrenciaByEstatoService(estadoSolicitacao)
            const ocorrencias = []
            tdOcorrencias.forEach(ocorrencia => {
                professor.turmas.forEach(turma => {
                    if(turma == ocorrencia.turma){
                        ocorrencias.push(ocorrencia)
                    }
                });
            });

            res.render('professor/solicitacoesProf', { ocorrencias })
    }
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const justificarFaltaDoAluno = async (req, res) => {
    try {
        const numBI = req.body.numBI
        const idSolicitacao = req.body.idSolicitacao
        const disciplina = req.body.disciplina
        const numfaltasString = req.body.numfaltas
        const numfaltas = parseInt(numfaltasString)
        const aluno = await findAlunoByNumBIService(numBI)
        const idAluno = aluno._id
        const faltas = await findFaltaBayIdAlunoService(idAluno)
        let falta = ''
        let idFalta = ''
        faltas.forEach(element => {
            if(element.disciplina == disciplina){
                idFalta = element._id
                for (var i = 0; i < numfaltas; i++) {
                    element.faltas.pop()
                    // more statements
                 }
                 falta = element
            }
        });
        await findFaltaByIdAndUpdateService(idFalta, falta)
        const solicitacao = await findSolicitacaoByIdService(idSolicitacao)
        solicitacao.estado = 'Justificada'
        const ocorrenciaUp = await findOcorrenciaByIdAndUpdateServece(idSolicitacao, solicitacao)
        req.flash('success_msg','Falta justificada com sucesso!')
        res.redirect('/pedagogico/solicitacoes')

    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}