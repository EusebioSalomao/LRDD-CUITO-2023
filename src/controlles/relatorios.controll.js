import fs from 'fs'
import pdf from 'html-pdf'
import ejs from 'ejs'
import { findPautaByIdTurma } from '../services/pauta.service.js'
import { findDadosTurmaByIdService, findTurmaByIdService } from '../services/turma.service.js'
import { findAnoLectivoByEstadoService, findAnoLectivoById } from '../services/anoLectivo.service.js'
import { findAllDespesasService, findAllReceitasService } from '../services/financas.service.js'
import { findAlunoByBIService, findAlunoByIdService, findAlunosByIdTurma } from '../services/aluno.service.js'
import { findOcorrenciaByIdAndUpdateServece, findSolicitacaoByIdService } from '../services/ocorrencias.service.js'
import { findCursoByIdService } from '../services/curso.service.js'
import { findClasseByIdService } from '../services/classe.service.js'


export const pautaTrimestral = async (req, res) => {
    try {

        //BUSCANDO DADOS DO BANCO
        const idTurma = req.params.id
        //return res.send(idTurma)

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
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do primeiro trimestre

            //Se for Segundo trimestre
            if (pauta.trimestre == 'Segundo Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT2.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do Segundo trimestre

            //Se for Terceiro trimestre
            if (pauta.trimestre == 'Terceiro Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT3.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//fim terceiro trimestre

            //Se for pauta final
            if (pauta.trimestre == 'Pauta Final') {
                pauta.dadosPauta.forEach(element => {
                    pautaF.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim Pauta final
        });
        console.log(disciplinas)


        // const pauta = await findPautaByIdService(idPauta)
        // const alunosDaTurma = await findAlunosByIdTurma(idTurma)
        // const notasDisciplinasTurma = await findMinipautasByIdTurma(idTurma)

        //VARIÁVEIR PARA PDF
        const classePDF = dadosTurma.idClasse.designacao
        const turmaPDF = dadosTurma.codigo
        const periodoPDF = dadosTurma.periodo
        const anoPdf = anoLectivo.codigo
        const date = new Date();

        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        //return res.send({pautaT1})


        //PARA GERAR RELATÓRIO
        ejs.renderFile("./views/relatorios/pautaI.ejs", {dia:dia, mes:mes,ano:ano, anoPdf: anoPdf, classePDF: classePDF, turmaPDF: turmaPDF, periodoPDF: periodoPDF, disciplinas: disciplinas, pautaT1: pautaT1 }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {
                pdf.create(html, {}).toFile("./relatorios/pauta_"+turmaPDF+"_ITrimestre.pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu')
                    } else {
                        req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios')
                        res.redirect('/pedagogico/pauta/'+idTurma)
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}



//SEGUNDO TRIMESTRE
export const pautaTrimestralII = async (req, res) => {
    try {

        //BUSCANDO DADOS DO BANCO
        const idTurma = req.params.id
        //return res.send(idTurma)

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
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do primeiro trimestre

            //Se for Segundo trimestre
            if (pauta.trimestre == 'Segundo Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT2.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do Segundo trimestre

            //Se for Terceiro trimestre
            if (pauta.trimestre == 'Terceiro Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT3.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//fim terceiro trimestre

            //Se for pauta final
            if (pauta.trimestre == 'Pauta Final') {
                pauta.dadosPauta.forEach(element => {
                    pautaF.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim Pauta final
        });
        console.log(disciplinas)


        // const pauta = await findPautaByIdService(idPauta)
        // const alunosDaTurma = await findAlunosByIdTurma(idTurma)
        // const notasDisciplinasTurma = await findMinipautasByIdTurma(idTurma)

        //VARIÁVEIR PARA PDF
        const classePDF = dadosTurma.idClasse.designacao
        const turmaPDF = dadosTurma.codigo
        const periodoPDF = dadosTurma.periodo
        const anoPdf = anoLectivo.codigo
        const date = new Date();

        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        //return res.send({pautaT2})


        //PARA GERAR RELATÓRIO
        ejs.renderFile("./views/relatorios/pautaII.ejs", {dia:dia, mes:mes,ano:ano, anoPdf: anoPdf, classePDF: classePDF, turmaPDF: turmaPDF, periodoPDF: periodoPDF, disciplinas: disciplinas, pautaT2: pautaT2 }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {
                pdf.create(html, {}).toFile("./relatorios/pauta_"+turmaPDF+"_IITrimestre.pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu')
                    } else {
                        req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios')
                        res.redirect('/pedagogico/pauta/'+idTurma)
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}


//TERCEIRO TRIMESTRE
export const pautaTrimestralIII = async (req, res) => {
    try {

        //BUSCANDO DADOS DO BANCO
        const idTurma = req.params.id
        //return res.send(idTurma)

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
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do primeiro trimestre

            //Se for Segundo trimestre
            if (pauta.trimestre == 'Segundo Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT2.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do Segundo trimestre

            //Se for Terceiro trimestre
            if (pauta.trimestre == 'Terceiro Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT3.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//fim terceiro trimestre

            //Se for pauta final
            if (pauta.trimestre == 'Pauta Final') {
                pauta.dadosPauta.forEach(element => {
                    pautaF.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim Pauta final
        });
        console.log(disciplinas)


        // const pauta = await findPautaByIdService(idPauta)
        // const alunosDaTurma = await findAlunosByIdTurma(idTurma)
        // const notasDisciplinasTurma = await findMinipautasByIdTurma(idTurma)

        //VARIÁVEIR PARA PDF
        const classePDF = dadosTurma.idClasse.designacao
        const turmaPDF = dadosTurma.codigo
        const periodoPDF = dadosTurma.periodo
        const anoPdf = anoLectivo.codigo
        const date = new Date();

        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        //return res.send({pautaT2})


        //PARA GERAR RELATÓRIO
        ejs.renderFile("./views/relatorios/pautaIII.ejs", {dia:dia, mes:mes,ano:ano, anoPdf: anoPdf, classePDF: classePDF, turmaPDF: turmaPDF, periodoPDF: periodoPDF, disciplinas: disciplinas, pautaT3: pautaT3 }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {
                pdf.create(html, {}).toFile("./relatorios/pauta_"+turmaPDF+"_III_Trimestre.pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu')
                    } else {
                        req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios')
                        res.redirect('/pedagogico/pauta/'+idTurma)
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
//PAUTA FINAL
export const pautaFinal = async (req, res) => {
    try {

        //BUSCANDO DADOS DO BANCO
        const idTurma = req.params.id
        //return res.send(idTurma)

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
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do primeiro trimestre

            //Se for Segundo trimestre
            if (pauta.trimestre == 'Segundo Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT2.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim do Segundo trimestre

            //Se for Terceiro trimestre
            if (pauta.trimestre == 'Terceiro Trimestre') {
                pauta.dadosPauta.forEach(element => {

                    pautaT3.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//fim terceiro trimestre

            //Se for pauta final
            if (pauta.trimestre == 'Pauta Final') {
                pauta.dadosPauta.forEach(element => {
                    pautaF.push(element)
                });
                const d = []
                pauta.discsTurma.forEach(element => {
                    d.push(element.disciplina)
                })
                disciplinas = d

            }//Fim Pauta final
        });
        console.log(disciplinas)


        // const pauta = await findPautaByIdService(idPauta)
        // const alunosDaTurma = await findAlunosByIdTurma(idTurma)
        // const notasDisciplinasTurma = await findMinipautasByIdTurma(idTurma)

        //VARIÁVEIR PARA PDF
        const classePDF = dadosTurma.idClasse.designacao
        const turmaPDF = dadosTurma.codigo
        const periodoPDF = dadosTurma.periodo
        const anoPdf = anoLectivo.codigo
        const date = new Date();

        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        //return res.send({pautaT2})


        //PARA GERAR RELATÓRIO
        ejs.renderFile("./views/relatorios/pautaFinal.ejs", {dia:dia, mes:mes,ano:ano, anoPdf: anoPdf, classePDF: classePDF, turmaPDF: turmaPDF, periodoPDF: periodoPDF, disciplinas: disciplinas, pautaF: pautaF }, (err, html) => {
            if (err) {
                return res.send('HOUVE UM ERRO!' + err)
            } else {
                pdf.create(html, {}).toFile("./relatorios/pauta_"+turmaPDF+"_Final.pdf", (err, re) => {
                    if (err) {
                        return res.send('Um erro aconteceu')
                    } else {
                        req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios')
                        res.redirect('/pedagogico/pauta/'+idTurma)
                    }
                })
            }
        })

    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}


//RELATORIO FINANCEIRO DO DIA
export const relFDiario = async (req, res) => {
    try {
        
        const date = new Date();
        const diaR = date
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        
        const despesas = await findAllDespesasService()
        const receitas = await findAllReceitasService()
        let relaDiario = []
        const relGeral = []
        
        //return res.send('Teste...')
       //PARA GERAR RELATÓRIO
       ejs.renderFile("./views/relatorios/relDiario.ejs", {diaR:diaR, dia:dia, mes:mes,ano:ano, despesas: despesas, receitas: receitas }, (err, html) => {
        if (err) {
            return res.send('HOUVE UM ERRO!' + err)
        } else {
            pdf.create(html, {}).toFile("./relatorios/rel"+dia+"_diario.pdf", (err, re) => {
                if (err) {
                    return res.send('Um erro aconteceu')
                } else {
                    req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios')
                    res.redirect('/financas/relatorios')
                }
            })
        }
    })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const declaracaoSemNota = async (req, res) => {
    try {
        const date = new Date();
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        
        const idAluno = req.body.idAluno
        const idSolic = req.body.idSolic
        const anoActivo = req.body.anoActivo
        const aluno = await findAlunoByIdService(idAluno)
        const nome = aluno.nome
        const curso = aluno.curso
        const classe = aluno.classe
        const nomeEncarregado = aluno.nomeEncarregado
        const numBI = aluno.numBI
        const solicitacao = await findSolicitacaoByIdService(idSolic)
        solicitacao.estado = 'Atendido'
        const update = await findOcorrenciaByIdAndUpdateServece(idSolic, solicitacao)
        //return res.send({update})
        
       //PARA GERAR RELATÓRIO
       ejs.renderFile("./views/relatorios/decSemNota.ejs", { dia:dia, mes:mes,ano:ano, nome: nome, curso: curso, nomeEncarregado: nomeEncarregado, classe: classe, numBI: numBI, curso: curso, anoActivo: anoActivo }, (err, html) => {
        if (err) {
            return res.send('HOUVE UM ERRO!' + err)
        } else {
            pdf.create(html, {}).toFile("./relatorios/decSemNota"+nome+"_.pdf", (err, re) => {
                if (err) {
                    return res.send('Um erro aconteceu')
                } else {
                    
                     req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios')
                    res.redirect('/pedagogico/pedidos') 
                }
            })
        }
    })
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
export const gerarListaAlunos = async (req, res) => {
    try {
        const date = new Date();
        let dia = date.getDate();
        let mes = date.toLocaleString('default', { month: 'long' });
        let ano = date.getFullYear();
        
        const idTurma = req.params.id
        const estado = 'Activo'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        const anoCod = anoLectivo.codigo
        const alunosT = await findAlunosByIdTurma(idTurma)

        let alunos = []
        alunosT.forEach(async aluno => {
            //PENDENTE
           await aluno.nome.toLowerCase().replace(/(?:^|\s)S/g, (a) => a.toUpperCase())
            alunos.push(aluno)
            
        });
        return res.send({alunos})

        const turma = await findTurmaByIdService(idTurma)
        const turmaCod = turma.codigo
        const idCurso = turma.idCurso
        const curso = await findCursoByIdService(idCurso)
        const classe = await findClasseByIdService(turma.idClasse)
        //return res.send({classe})

        
       //PARA GERAR RELATÓRIO
       ejs.renderFile("./views/relatorios/listaAlunos.ejs", { dia:dia, mes:mes, ano:ano, alunos: alunos, curso: curso, anoCod: anoCod, classe: classe, turmaCod: turmaCod }, (err, html) => {
        if (err) {
            return res.send('HOUVE UM ERRO!' + err)
        } else {
            const options = {
                format: "A4",
                margin: {
                    top: '10px',
                    bottom: '20px',
                    left: '20px',
                    right: '20px'
                },
                header: {
                    height: "15mm"
                },
                footer: {
                    height: "25mm"
                }
                
            }
            pdf.create(html, options).toFile("./relatorios/listas/listaAlunos_"+turmaCod+"-"+classe.designacao+".pdf", (err, re) => {
                if (err) {
                    return res.send('Um erro aconteceu ao guradar lista')
                } else {
                     req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios em C:/')
                    res.redirect('/turmas/gerarLista/'+idTurma) 
                }
            })
        }
    })
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}