import { findAlunoByNumBIService, findAlunosByIdAnoService, findAlunosByIdTurma } from "../services/aluno.service.js"
import { findAnoLectivoByEstadoService, findAnoLectivoById } from "../services/anoLectivo.service.js"
import { findAllClassesService, findClassesByIdAno } from "../services/classe.service.js"
import { findCursosByIdAnoService } from "../services/curso.service.js"
import { findDisciplinaByIdClasse } from "../services/disciplina.service.js"
import { findFuncionarioByFuncaoService } from "../services/funcionario.service.js"
import { findAllMinipautasService, findMinipautasByIdAnoService, findMinipautasByIdTurma } from "../services/minipauta.service.js"
import { findNotasDisciplinaByIdClasse } from "../services/notasDisciplina.service.js"
import { findOcorrenciaByEstatoService, findOcorrenciaByIdAndUpdateServece, findOcorrenciaTipoService, findSolicitacaoByIdService } from "../services/ocorrencias.service.js"
import { createPautaService, findAllPautasService, findOnePautaByIdTurma, findPautaByIdService, findPautaByIdTurma, findPautaByTrimestre, findPautasByIdAnoService } from "../services/pauta.service.js"
import { findDadosTurmaByIdService, findTurmaByIdService, findTurmasByIdAno } from "../services/turma.service.js"

export const pedagogicoHome = async (req, res) => {
    try {
        const estado = 'Pendente'
        const tipo = 'Pedido de Declaração'
        
        const pedidos = await findOcorrenciaTipoService(tipo)
        const pedDeclaracao = []
        pedidos.forEach(element => {
            if(element.estado == 'Pendente'){
                pedDeclaracao.push(element)
            }
        });
        //return res.send({pedDeclaracao})
        res.render('pedagogico/pedagoHome', {pedDeclaracao})
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const gerarPauta = async (req, res) => {
    try {
        const idTurma = req.body.turma
        const classe = req.body.classe
        const trimestre = req.body.trimestre

        if (idTurma == 'selecionar' || classe == 'selecionar' || trimestre == 'selecionar') {
            req.flash('error_msg', 'Não foi possível gerar a pauta. Seleciona corretamnete os campos!')
            res.redirect('/pedagogico/pautas')
        } else {
            const turma = await findTurmaByIdService(idTurma)
            const idClasse = turma.idClasse
            const idCurso = turma.idCurso
            const idAno = turma.idAno
            const disciplinas = await findDisciplinaByIdClasse(idClasse)
            const nomesDisciplina = []
            disciplinas.forEach(disciplina => {
                nomesDisciplina.push(disciplina.nomeDisciplina)
            });

            //SE FOR DO Iº TRIMESTRE
            if (trimestre == 'trimestre1') {
                //return res.send('Primeiro trimestre')
                const trimest = 'Primeiro Trimestre'
                const verifyPauta = await findPautaByTrimestre(trimest)
                if (verifyPauta) {
                    req.flash('error_msg', 'Já existe uma pauta do I Trimestre dessa turma!')
                    res.redirect('/pedagogico/pautas')
                } else {
                    //return res.send('Não Achado!')
                    const alunosDaTurma = await findAlunosByIdTurma(idTurma)
                    const notasClasse = await findNotasDisciplinaByIdClasse(idClasse)

                    const dadosPauta = []
                    let discsTurma = []
                    alunosDaTurma.forEach(aluno => {
                        const disciplinas = []
                        const nome = aluno.nome
                        const idAluno = aluno._id
                        //dadosPauta.push(nome)
                        //dadosPauta.push(idAluno)
                        const notas = {
                            notas: []
                        }

                        notasClasse.forEach(nota => {
                            if ('' + aluno._id == nota.aluno) {
                                console.log('Sucesso4!')
                                let disciplina = {
                                    disciplina: nota.idMinipauta.nomeDisciplina
                                }
                                disciplinas.push(disciplina)
                                const discpNota = {
                                    disciplina: nota.idMinipauta.nomeDisciplina,
                                    nota: nota.notas.mt1
                                }
                                notas.notas.push(discpNota)

                            }
                        });
                        if (discsTurma.length == 0) {
                            discsTurma = disciplinas
                        }
                        const alunoDado = {
                            nome: nome,
                            idAluno: idAluno,
                            notas: notas
                        }
                        dadosPauta.push(alunoDado)
                    });
                    /* discsTurma.forEach(element => {
                        console.log(element.disciplina)
                    }); */
                    //return res.send({discsTurma})
                    const pauta = {
                        trimestre: 'Primeiro Trimestre',
                        discsTurma: discsTurma,
                        anoLectivo: idAno,
                        turma: idTurma,
                        curso: idCurso,
                        classe: idClasse,
                        dadosPauta: dadosPauta
                    }
                    const pautaCreada = await createPautaService(pauta)
                    //return res.send({ pautaCreada })
                    req.flash('success_msg', 'Pauta gerada com sucesso! Clica em ver pautas da turma correspondente.')
                    res.redirect('/pedagogico/pautas')



                }
            }//FIM DO Iº TRIMESTRE

            //SE FOR DO IIº TRIMESTRE
            if (trimestre == 'trimestre2') {
                //return res.send('Segungo trimestre')
                const trimest = 'Segundo Trimestre'
                const verifyPauta = await findPautaByTrimestre(trimest)
                if (verifyPauta) {
                    req.flash('error_msg', 'Já existe uma pauta do IIº Trimestre dessa turma!')
                    res.redirect('/pedagogico/pautas')
                } else {
                    //return res.send('Não Achado!')
                    const alunosDaTurma = await findAlunosByIdTurma(idTurma)
                    const notasClasse = await findNotasDisciplinaByIdClasse(idClasse)

                    const dadosPauta = []
                    let discsTurma = []
                    alunosDaTurma.forEach(aluno => {
                        const disciplinas = []
                        const nome = aluno.nome
                        const idAluno = aluno._id
                        const notas = {
                            notas: []
                        }

                        notasClasse.forEach(nota => {
                            if ('' + aluno._id == nota.aluno) {
                                // console.log('Sucesso4!')
                                let disciplina = {
                                    disciplina: nota.idMinipauta.nomeDisciplina
                                }
                                disciplinas.push(disciplina)
                                const discpNota = {
                                    disciplina: nota.idMinipauta.nomeDisciplina,
                                    nota: nota.notas.mt2
                                }
                                notas.notas.push(discpNota)

                            }
                        });
                        if (discsTurma.length == 0) {
                            discsTurma = disciplinas
                        }
                        const alunoDado = {
                            nome: nome,
                            idAluno: idAluno,
                            notas: notas
                        }
                        dadosPauta.push(alunoDado)
                    });

                    //return res.send({dadosPauta})
                    const pauta = {
                        trimestre: 'Segundo Trimestre',
                        discsTurma: discsTurma,
                        anoLectivo: idAno,
                        turma: idTurma,
                        curso: idCurso,
                        classe: idClasse,
                        dadosPauta: dadosPauta
                    }
                    const pautaCreada = await createPautaService(pauta)
                    //return res.send({ pautaCreada })
                    req.flash('success_msg', 'Pauta gerada com sucesso! Clica em ver pautas da turma correspondente.')
                    res.redirect('/pedagogico/pautas')
                }
            }//FIM DO IIº TRIMESTRE

            //SE FOR DO IIIº TRIMESTRE
            if (trimestre == 'trimestre3') {
                //return res.send('Segungo trimestre')
                const trimest = 'Terceiro Trimestre'
                const verifyPauta = await findPautaByTrimestre(trimest)
                if (verifyPauta) {
                    req.flash('error_msg', 'Já existe uma pauta do IIIº Trimestre dessa turma!')
                    res.redirect('/pedagogico/pautas')
                } else {
                    //return res.send('Não Achado!')
                    const alunosDaTurma = await findAlunosByIdTurma(idTurma)
                    const notasClasse = await findNotasDisciplinaByIdClasse(idClasse)

                    const dadosPauta = []
                    let discsTurma = []
                    alunosDaTurma.forEach(aluno => {
                        const disciplinas = []
                        const nome = aluno.nome
                        const idAluno = aluno._id
                        const notas = {
                            notas: []
                        }

                        notasClasse.forEach(nota => {
                            if ('' + aluno._id == nota.aluno) {
                                // console.log('Sucesso4!')
                                let disciplina = {
                                    disciplina: nota.idMinipauta.nomeDisciplina
                                }
                                disciplinas.push(disciplina)
                                const discpNota = {
                                    disciplina: nota.idMinipauta.nomeDisciplina,
                                    nota: nota.notas.mt3
                                }
                                notas.notas.push(discpNota)

                            }
                        });
                        if (discsTurma.length == 0) {
                            discsTurma = disciplinas
                        }
                        const alunoDado = {
                            nome: nome,
                            idAluno: idAluno,
                            notas: notas
                        }
                        dadosPauta.push(alunoDado)
                    });

                    //return res.send({dadosPauta})
                    const pauta = {
                        trimestre: 'Terceiro Trimestre',
                        discsTurma: discsTurma,
                        anoLectivo: idAno,
                        turma: idTurma,
                        curso: idCurso,
                        classe: idClasse,
                        dadosPauta: dadosPauta
                    }
                    const pautaCreada = await createPautaService(pauta)
                    //return res.send({ pautaCreada })
                    req.flash('success_msg', 'Pauta gerada com sucesso! Clica em ver pautas da turma correspondente.')
                    res.redirect('/pedagogico/pautas')
                }
            }//FIM DO IIIº TRIMESTRE

            //SE FOR PAUTA FINAL
            if (trimestre == 'pautaFinal') {
                //return res.send('Pauta final')
                const trimest = 'Pauta Final'
                const verifyPauta = await findPautaByTrimestre(trimest)
                if (verifyPauta) {
                    req.flash('error_msg', 'Já existe uma pauta final desta turma!')
                    res.redirect('/pedagogico/pautas')
                } else {
                    //return res.send('Não Achado!')
                    const alunosDaTurma = await findAlunosByIdTurma(idTurma)
                    const notasClasse = await findNotasDisciplinaByIdClasse(idClasse)

                    const dadosPauta = []
                    let discsTurma = []
                    alunosDaTurma.forEach(aluno => {
                        const disciplinas = []
                        const nome = aluno.nome
                        let estado = ''
                        let negativas = 0
                        const idAluno = aluno._id
                        const notas = {
                            notas: []
                        }

                        notasClasse.forEach(nota => {
                            if ('' + aluno._id == nota.aluno) {
                                // console.log('Sucesso4!')
                                //contar negativa
                                if (nota.notas.cf < 10 || nota.notas.cf == '') { negativas += 1 }

                                //criar disciplina
                                let disciplina = {
                                    disciplina: nota.idMinipauta.nomeDisciplina
                                }
                                disciplinas.push(disciplina)//adicionar disc 
                                const discpNota = {
                                    disciplina: nota.idMinipauta.nomeDisciplina,
                                    nota: nota.notas.cf
                                }
                                notas.notas.push(discpNota)

                            }
                        });
                        //Condição para aprovar ou reprovar
                        if (negativas > 4) { estado = 'Reprovado' } else { estado = 'Aprovado' }
                        if (discsTurma.length == 0) {
                            discsTurma = disciplinas
                        }
                        const alunoDado = {
                            nome: nome,
                            estado: estado,
                            idAluno: idAluno,
                            notas: notas
                        }
                        dadosPauta.push(alunoDado)
                    });

                    // return res.send({dadosPauta})
                    const pauta = {
                        trimestre: 'Pauta Final',
                        discsTurma: discsTurma,
                        anoLectivo: idAno,
                        turma: idTurma,
                        curso: idCurso,
                        classe: idClasse,
                        dadosPauta: dadosPauta
                    }
                    const pautaCreada = await createPautaService(pauta)
                    //return res.send({ pautaCreada })
                    req.flash('success_msg', 'Pauta gerada com sucesso! Clica em ver pautas da turma correspondente.')
                    res.redirect('/pedagogico/pautas')
                }
            }//FIM PAUTA FINAL

            // res.send({nomesDisciplina})
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const minipautas = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivoActivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivoActivo._id
        const minipautas = await findMinipautasByIdAnoService(idAno)
        // return res.send({minipautas})


        res.render('pedagogico/minipautasPed', { minipautas, anoLectivoActivo })

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })

    }
}

export const pautas = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivo._id
        const pautas = await findPautasByIdAnoService(idAno)
        const turmas = await findTurmasByIdAno(idAno)
        const pautas10 = []
        const pautas11 = []
        const pautas12 = []
        turmas.forEach(element => {
            if (element.idClasse.designacao == '10ª Classe') {
                pautas10.push(element)
            }
            if (element.idClasse.designacao == '11ª Classe') {
                pautas11.push(element)
            }
            if (element.idClasse.designacao == '12ª Classe') {
                pautas12.push(element)
            }

        });
        //return res.send({turmas})
        res.render('pedagogico/pautas', { turmas, pautas10, pautas11, pautas12, anoLectivo })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const pauta = async (req, res) => {
    try {
        const idTurma = req.params.id

        const pautas = await findPautaByIdTurma(idTurma)
        const pautaT1 = []
        const pautaT2 = []
        const pautaT3 = []
        const pautaF = []

        const dadosTurma = await findDadosTurmaByIdService(idTurma)
        const anoLectivo = await findAnoLectivoById(dadosTurma.idAno)
        //return res.send({anoLectivo})
        let disciplinas = []
        pautas.forEach(pauta => {

            //Se for Primeiro trimestre
            if (pauta.trimestre == 'Primeiro Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT1.push(element)
                });
                disciplinas = pauta.discsTurma

            }//Fim do primeiro trimestre

            //Se for Segundo trimestre
            if (pauta.trimestre == 'Segundo Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT2.push(element)
                });
                disciplinas = pauta.discsTurma

            }//Fim do Segundo trimestre

            //Se for Terceiro trimestre
            if (pauta.trimestre == 'Terceiro Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT3.push(element)
                });
                disciplinas = pauta.discsTurma

            }//fim terceiro trimestre

            //Se for pauta final
            if (pauta.trimestre == 'Pauta Final') {
                pauta.dadosPauta.forEach(element => {
                    pautaF.push(element)
                });
                disciplinas = pauta.discsTurma

            }//Fim Pauta final
        });


        //return res.send({dadosTurma})
        // const pauta = await findPautaByIdService(idPauta)
        // const alunosDaTurma = await findAlunosByIdTurma(idTurma)
        // const notasDisciplinasTurma = await findMinipautasByIdTurma(idTurma)
        res.render('pedagogico/pauta', { pautaT1, pautaT2, pautaT3, disciplinas, dadosTurma, pautaF, anoLectivo })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const alunos = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivo._id
        const alunos = await findAlunosByIdAnoService(idAno)
        //return res.send({alunos})
        res.render('pedagogico/alunos', { alunos, anoLectivo })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const turmas = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivo._id
        const turmas = await findTurmasByIdAno(idAno)
        //return res.send({turmas})
        const turmas10 = []
        const turmas11 = []
        const turmas12 = []
        turmas.forEach(element => {
            if (element.idClasse.designacao == "10ª Classe") {
                turmas10.push(element)
            }
            if (element.idClasse.designacao == "11ª Classe") {
                turmas11.push(element)
            }
            if (element.idClasse.designacao == "12ª Classe") {
                turmas12.push(element)
            }
        });
        res.render('pedagogico/turmas', { turmas10, turmas11, turmas12, anoLectivo })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const classes = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivo._id
        const cursos = await findCursosByIdAnoService(idAno)
        const classes = await findClassesByIdAno(idAno)
        cursos.forEach(curso => {
            curso.classes = []
            classes.forEach(classe => {
                if (curso._id == classe.idCurso) {
                    curso.classes.push(classe)
                }
            });
        });
        // return res.send(cursos)
        res.render('pedagogico/classes', { cursos, anoLectivo })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const cursos = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivo._id
        const cursos = await findCursosByIdAnoService(idAno)
        const classes = await findAllClassesService()
        cursos.forEach(curso => {
            let vagas = 0
            let turmas = 0
            classes.forEach(classe => {
                if (curso._id == classe.idCurso) {
                    vagas += classe.numVagas
                    classe.turmas.forEach(element => {
                        turmas += 1
                    });
                }
                curso.vagas = vagas
                curso.turmas = turmas
            });
        });
        //return res.send(cursos)
        res.render('pedagogico/cursos', { cursos, anoLectivo })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
/* export const professores = async (req, res) => {
    try {
        const estado = 'Activo'
        const funcao = 'professor'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivo._id
        const professores = await findFuncionarioByFuncaoService(funcao)
        //return res.send({professores})
        
        res.render('pedagogico/professores', {anoLectivo})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
 */

export const matricular = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivoActivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivoActivo._id
        res.redirect('/anosLectivo/config/' + idAno)
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const solicitacoes = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoLectivoActivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoLectivoActivo._id
        const estadoSolicitacao = 'Pendente'
        const ocorrencias = await findOcorrenciaByEstatoService(estadoSolicitacao)
        res.render('pedagogico/solicitacoes', { ocorrencias })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const solicitacao = async (req, res) => {
    try {
        const idSolicitacao = req.params.idSolicitacao
        const solicitacao = await findSolicitacaoByIdService(idSolicitacao)

        res.render('pedagogico/detalhSolicitacao', { solicitacao })

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const autorizarJustific = async (req, res) => {
    try {
        const idSolicitacao = req.body.idSolicitacao
        const solicitacao = await findSolicitacaoByIdService(idSolicitacao)
        solicitacao.autorizado = 'Sim'
        await findOcorrenciaByIdAndUpdateServece(idSolicitacao, solicitacao)
        //return res.send({solicitacao})
        res.redirect('/pedagogico/solicitacao/' + idSolicitacao)

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const pedidos = async (req, res) => {
    try {
        const tipo = 'Pedido de Declaração'
        const pedidos = await findOcorrenciaTipoService(tipo)
        const pedDeclaracao = []
        pedidos.forEach(element => {
            if(element.estado == 'Pendente'){
                pedDeclaracao.push(element)
            }
        });
        
        //return res.send({pedDeclaracao})
        res.render('pedagogico/novasSolicitacoes', {pedDeclaracao})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const atenderDec = async (req, res) => {
    try {
        const numBI = req.body.numBI
        const comNotas = req.body.comNotas
        const idSolic = req.body.idSolic
        const aluno = await findAlunoByNumBIService(numBI)
        const pautas = await findAllPautasService()
        //res.send({comNotas})

        if(comNotas == 'Sim'){

            const dadoAluno = []
            
            pautas.forEach(pauta => {
                pauta.dadosPauta.forEach(dado => {
                    if(dado.idAluno == ''+aluno._id){
                        dadoAluno.push(dado)
                    }
                });
            });
            const notas = []
            /* dadoAluno.notas.notas.forEach(nota => {
                notas.push(nota)
            }); */
            
        }else{
            const estadoa = 'Activo'
            const anoActivo = await findAnoLectivoByEstadoService(estadoa)
           // return res.send({estadoa})

            return res.render('pedagogico/declaracao', {aluno, anoActivo, idSolic})
        }
        } catch (error) {
            res.status(500).send({mesage: error.mesage})
        }
}








