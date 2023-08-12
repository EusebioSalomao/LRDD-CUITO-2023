import { createAlunoService, findAllAlunosService, findAlunoByIdService } from "../services/aluno.service.js"
import { findCandByIdService, findCandByNumBIService } from "../services/candidato.service.js"
import { findFaltaBayIdAlunoService } from "../services/faltas.service.js"
//import { findClasseByIdService } from "../services/classe.service.js"
import { createNotaClasse, createNotaTrimestral } from "../services/notas.service.js"
import { findNotasDisciplinaByIdAluno, findNotasDisciplinaByIdAlunoPerfil } from "../services/notasDisciplina.service.js"
import { findPautaByIdTurma } from "../services/pauta.service.js"
import { findTurmaByIdService } from "../services/turma.service.js"
import { createUserService, findUserByIdService } from "../services/user.service.js"


export const tdAlunos = async (req, res) => {
    try {
        const alunos = await findAllAlunosService()
        res.render('alunos/tdAlunos', { alunos })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const wAdmitir = async (req, res) => {
    try {
        const id = req.params.id
        const candidato = await findCandByIdService(id)
        const estado = candidato.estado
        if (estado != 'Admitido') {
            req.flash('error_msg', 'Este candidato não pode efectuar matricula! Apenas os admitidos')
            res.redirect('/candidatos')
        } else {

            res.render('alunos/adAdmintido', { candidato })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const matricular = async (req, res) => {
    try {
        const bi = req.body.numBI
        const veryBICand = await findCandByNumBIService(bi)
        const veryBI = await findAlunoByBIService(bi)
        const candidato = req.body;
        candidato._id = req.params.id
        const erros = []
        if (veryBICand._id != req.params.id) {
            //return res.send('O Bi não coreesponde')
             erros.push({ texto: 'O número do BI não corresponde ao aluno admitido!' })
            
        } 
        if (veryBI) {
            //return res.send('Já existe um registro com este BI')
            erros.push({ texto: "Já existe um registro com este BI"})
        }
        if (veryBICand.curso != req.body.curso) {
            //return res.send('Foste admitido para o curso de ' + veryBICand.curso)
            erros.push({ texto: 'Foste admitido para o curso de ' + veryBICand.curso })
        }
        if (erros.length > 0) {
            res.render('alunos/adAdmintido', { candidato, erros })
        }else{
            //return res.send('O Bi Corresponde, pode matricular')
            /* Criar usuario */
            
            const novoUsuario = {
                username: req.body.numBI,
                senha: req.body.numBI,
                telefone: req.body.contacto
            }
            //return res.send({novoUsuario})
            /* Criar notas trimestral */
            const criarNotatrimestra = {
                primeiroTrimestre: [],
                segundoTrimestre: [],
                terceiroTrimestre: [],
                examePF: []
            }
            const notasTrimestrias = await createNotaTrimestral(criarNotatrimestra)

            /* Criar notas de classe */
            const criarNotaClass = {
                classe10: notasTrimestrias._id,
                classe11: notasTrimestrias._id,
                classe12: notasTrimestrias._id
            }
            const notasclasses = await createNotaClasse(criarNotaClass)
           const userAluno = await createUserService(novoUsuario)
           const aluno = req.body;
           aluno.usuario = userAluno._id;
           aluno.notas = notasclasses._id;
           aluno.classe = '10ª Classe';
            const al = await createAlunoService(aluno)
            req.flash('success_msg', 'Aluno matriculado com sucesso!')
            res.redirect('/alunos')

        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const fichaAluno = async (req, res) => {
    try {
        const idAluno = req.params.id
        const aluno = await findAlunoByIdService(idAluno)
        const turma = await findTurmaByIdService(aluno.idTurma)
        const usuario = await findUserByIdService(aluno.usuario)
        const notasDisciplina = await findNotasDisciplinaByIdAlunoPerfil(idAluno)
        const tdFaltas = await findFaltaBayIdAlunoService(idAluno)
        const pautas = await findPautaByIdTurma(turma._id)
        let pautaFinal = []
        let dadosFinal = []
        let disciplinas = []
        
        if(pautas){
            pautas.forEach(pauta => {
                if(pauta.trimestre == 'Pauta Final'){
                    pautaFinal = pauta
                    disciplinas = pauta.discsTurma
                }
            });
        }
        if(!pautaFinal === ''){
            pautaFinal.dadosPauta.forEach(dado => {
                if(dado.idAluno == idAluno){
                    //console.log('Sucesso!')
                    dadosFinal = dado
                }
            });
        }
        //return res.send("Sucesso!")
        

        //return res.send({dadosFinal})
        res.render("alunos/fichaAluno", {aluno, turma, usuario, notasDisciplina, tdFaltas,dadosFinal, disciplinas})
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}