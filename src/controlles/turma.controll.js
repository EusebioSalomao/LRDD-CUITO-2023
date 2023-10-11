import ejs from 'ejs'
import path from 'path'
import pdf from 'html-pdf'

import { createAlunoService, findAlunoByBIService, findAlunosByIdTurma } from "../services/aluno.service.js";
import { findAnoLectivoById, findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js";
import { findAllCandidatosByCursoService, findCandByIdAndUpdateService, findCandByIdService, findCandByNumBIService } from "../services/candidato.service.js";
import { addTurmaClasseService, findAllClassesByIdCurso, findClasseByIdAndUpdate, findClasseByIdService } from "../services/classe.service.js";
import { findCursoByIdService } from "../services/curso.service.js";
import { findAllDiscplinasService, findDisciplinaByIdAndUpdateService, findDisciplinaByIdClasse, findDisciplinaByIdService } from "../services/disciplina.service.js";
import { findAllFuncionariosService, findFuncionarioByIdAndUpdateService, findFuncionariosByIdService } from "../services/funcionario.service.js";
import { creatMinipautaService, findMinipautasByIdTurma, findOneMinipautaByIdTurma } from "../services/minipauta.service.js";
import { createNotaTrimestral } from "../services/notas.service.js";
import { createNotasDisciplinaService, findNotasDisciplinaByIdMinipautaService } from "../services/notasDisciplina.service.js";
import { createPautaService } from "../services/pauta.service.js";
import { createTurmaService, findAllTurmasService, findTurmaByIdCursoService, findTurmaByIdService, findTurmasByIdClassedService } from "../services/turma.service.js";
import { createUserService } from "../services/user.service.js";

export const tdTurmas = async (req, res) => {
    try {
        const turmas = await findAllTurmasService()
        if (turmas) {
            return res.send({ turmas })

        } else {
            return res.send('Não ha turmas registradas')

        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const addTurma = async (req, res) => {
    try {
        const turma = req.body;
        const idAno = req.body.idAno
        const idCurso = turma.idCurso
        let idTurma = ''

        let exist = ''
        if (req.body.periodo == 'selecionar') {
            exist = 'Não foi possível criar a turma porque faltou selecionar o período!'
        }

        const verifyAllTurmas = await findTurmaByIdCursoService(idCurso)

        verifyAllTurmas.forEach(element => {
            if (element.codigo == req.body.codigo) {
                exist = 'Esta turma já está adicionada!'
            }
        });
        const classes = await findAllClassesByIdCurso(idCurso)
        if (exist == '') {
            let idClasse = ''
            if (!classes) {
                return res.send('Nenhuma classe encontrada"')
            } else {
                classes.forEach(element => {
                    if (element.designacao === turma.classe) {
                        console.log("Classe achada!")
                        idClasse = element._id
                        // element.turmas.push(idTurma)
                    } else {
                        console.log("Não achada!")
                    }
                });
                turma.idClasse = idClasse
                const novaTurma = await createTurmaService(turma);
                idTurma = novaTurma._id
                const novaPauta = {
                    anoLectivo: idAno,
                    turma: idTurma,
                    classe: idClasse,
                    curso: idCurso
                }
                const pautaCriada = await createPautaService(novaPauta)
                //return res.send({pautaCriada})

            }
            const classeUpdade = await addTurmaClasseService(idClasse, idTurma)

            const ano = await findAnoLectivoById(idAno)
            const curso = await findCursoByIdService(idCurso)
            const msg = "Turma adicionada com sucesso"
            //res.redirect('/turmas/turma/'+idTurma)
            res.render('admin/cursos/gerirCurso', { curso, ano, classes, msg })
        } else {
            const ano = await findAnoLectivoById(idAno)
            const curso = await findCursoByIdService(idCurso)
            res.render('admin/cursos/gerirCurso', { curso, ano, classes, exist })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const gerirTurmas = async (req, res) => {
    try {
        const idAno = req.body.idAno
        const idCurso = req.body.idCurso
        const idClasse = req.body.idClasse
        
        const ano = await findAnoLectivoById(idAno)
        const curso = await findCursoByIdService(idCurso)
        const classe = await findClasseByIdService(idClasse)
        const turmas = await findTurmasByIdClassedService(idClasse)

        let classe10 = ''
        let classe11 = ''
        let classe12 = ''
        if (classe.designacao == "10ª Classe") {
            classe10 = classe.designacao
        }
        if (classe.designacao == "11ª Classe") {
            classe11 = classe.designacao
        }
        if (classe.designacao == "12ª Classe") {
            classe12 = classe.designacao
        }

        const disciplinas = await findDisciplinaByIdClasse(idClasse)
        //return res.send({disciplinas})
        res.render('admin/turmas/gerirTurmas', {disciplinas, turmas, ano, classe, curso, classe10, classe11, classe12 })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const turma = async (req, res) => {
    try {
        const user = req.user
        if(!user){
            //return res.send('Não estas logado!')
            req.flash('error_msg', 'Inicie sua sessão!')
            res.redirect('/user/login')
        }else{
        let eProf = ''

        const idTurma = req.params.id
        const turma = await findTurmaByIdService(idTurma)
        const idClasse = turma.idClasse
        const classe = await findClasseByIdService(idClasse)
        const ano = await findAnoLectivoById(turma.idAno)
        const curso = await findCursoByIdService(turma.idCurso)
        const candidatos = await findAllCandidatosByCursoService(curso.descricao)
        const alunos = await findAlunosByIdTurma(idTurma)
        let naoVagas = ''
        if (classe.numVagas < 1) {
            naoVagas = 'Não existe mais vagas nesta classe!'
        }
        const candMatricular = []
        candidatos.forEach(element => {
            if (element.estado == "Admitido") {
                element.idTurma = idTurma
                candMatricular.push(element)

            }
        });

        let classe10 = ''
        let classe11 = ''
        let classe12 = ''
        if (classe.designacao == "10ª Classe") {
            classe10 = classe.designacao
        }
        if (classe.designacao == "11ª Classe") {
            classe11 = classe.designacao
        }
        if (classe.designacao == "12ª Classe") {
            classe12 = classe.designacao
        }

        return res.render('admin/turmas/turma', { alunos, turma, classe, ano, curso, classe10, classe11, classe12, candMatricular, idTurma, naoVagas })
    }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const miniPauta = async (req, res) => {
    try {
        const user = req.user
        let lancarNota = ''
        const idTurma = req.params.id
       
       const tdTurmas = await findAllTurmasService()
       const alunosTurma = await findAlunosByIdTurma(idTurma)
       const turma = await findTurmaByIdService(idTurma)
       let curso = await findCursoByIdService(turma.idCurso)
       curso = curso.descricao
       
       
       
        let numeroOrd = 1
        alunosTurma.forEach(aluno => {
            aluno.numeroOrd = numeroOrd++
        });

        res.render('admin/turmas/minipautaTurma' , { turma, curso, alunosTurma, lancarNota })

    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
export const miniPautaPDF = async (req, res) => {
    try {

        const user = req.user
        const idTurma = req.params.id
       
       const alunosTurma = await findAlunosByIdTurma(idTurma)
       const turma = await findTurmaByIdService(idTurma)
       let curso = await findCursoByIdService(turma.idCurso)
       curso = curso.descricao
       
       
       let classe = await findClasseByIdService(turma.idClasse)
       let anoLectivo = await findAnoLectivoById(turma.idAno)
       const codTurma = turma.codigo
       classe = classe.designacao
       anoLectivo = anoLectivo.codigo
       
       
       
       // return res.send('Sim')
        
        




       //GERANDO PDF
       const date = new Date();
       const diaR = date
       let dia = date.getDate();
       let mes = date.toLocaleString('default', { month: 'long' });
       let ano = date.getFullYear();
       ejs.renderFile("./views/admin/turmas/minipautaPDF.ejs", { dia:dia, mes:mes, ano:ano, anoLectivo, alunosTurma, curso, codTurma, classe }, (err, html) => {
        if (err) {
            return res.send('HOUVE UM ERRO!' + err)
        } else {

            const options = {
                format: "A4",
                orientation: 'Landscape',
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
            pdf.create(html, options).toFile("./relatorios/minipautas/"+classe+"-"+turma.codigo+"-minipauta.pdf", (err, re) => {
                if (err) {
                    return res.send('Um erro aconteceu ao guradar lista')
                } else {
                     req.flash('success_msg','Arquivo gerado com sucesso! veja na pasta de relatórios em C:/')
                    res.redirect('/turmas/turma/'+idTurma) 
                }
            })
        }
    })

    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}


export const gerarLista = async (req, res) => {
    try {
        const idTurma = req.params.id
        const estado = 'Activo'
        const ano = await findAnoLectivoByEstadoService(estado)
        const alunos = await findAlunosByIdTurma(idTurma)
        const turma = await findTurmaByIdService(idTurma)
        const idCurso = turma.idCurso
        const curso = await findCursoByIdService(idCurso)
        const classe = await findClasseByIdService(turma.idClasse)
        let num = 1
        alunos.forEach(aluno => {
            aluno.numero = num++ 
        });
        //return res.send({classe})

        res.render('admin/turmas/gerarLista', {turma, curso, alunos, ano, classe})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const turmaP = async (req, res) => {
    try {
        const idTurma = req.params.id
        const turma = await findTurmaByIdService(idTurma)
        const idClasse = turma.idClasse
        const idAno = turma.idAno
        const classe = await findClasseByIdService(idClasse)
        const ano = await findAnoLectivoById(idAno)
        const idCurso = turma.idCurso
        const curso = await findCursoByIdService(idCurso)
        const candidatos = await findAllCandidatosByCursoService(curso.descricao)
        const alunos = await findAlunosByIdTurma(idTurma)
        const tdDisciplinas = await findAllDiscplinasService()
        const disciplinas = await findDisciplinaByIdClasse(idClasse)
        tdDisciplinas.forEach(element => {
            if (element.idClasse == idClasse) {
                disciplinas.push(element)
            }
        });
        let funcionarios = await findAllFuncionariosService()
        let professores = []
        let professoresDaT = []
        funcionarios.forEach(element => {
            if (element.funcao == 'professor' || element.funcao == 'professora') {
                element.idTurma = idTurma
                professores.push(element)
            }
        });
        /* Cogo reservado */
        /*
       const minip = await findMinipautasByIdTurma(idTurma)
       minip.forEach(mini => {
           
           if(mini.idProfessor == ""+prof._id && mini.idTurma == t)
           prof.discActual = mini.nomeDisciplina
           prof.idTurma = idTurma
           prof.idClasse = idClasse
           prof.idCurso = idCurso
           prof.idAno = idAno
       //console.log({prof})
   });
   */
  //return res.send({funcionarios})
   funcionarios.forEach(prof => {
    prof.turmas.forEach(tur => {
        if(tur == idTurma){
            console.log
            
            professoresDaT.push(prof)
        }
    });
});
        let naoVagas = ''
        if (classe.numVagas < 1) {
            naoVagas = 'Não existe mais vagas nesta classe!'
        }
        const candMatricular = []
        candidatos.forEach(element => {
            if (element.estado == "Admitido") {
                element.idTurma = idTurma
                candMatricular.push(element)

            }
        });

        let classe10 = ''
        let classe11 = ''
        let classe12 = ''
        if (classe.designacao == "10ª Classe") {
            classe10 = classe.designacao
        }
        if (classe.designacao == "11ª Classe") {
            classe11 = classe.designacao
        }
        if (classe.designacao == "12ª Classe") {
            classe12 = classe.designacao
        }

        return res.render('admin/turmas/turmaP', { professores, professoresDaT, turma, classe, ano, curso, classe10, classe11, classe12, candMatricular, idTurma, naoVagas, disciplinas })
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const novaMatricula = async (req, res) => {
    try {
        const idTurma = req.body.idTurma
        const idCandidato = req.body.idCandidato

        const candidato = await findCandByIdService(idCandidato)
        const turma = await findTurmaByIdService(idTurma)
        const classe = await findClasseByIdService(turma.idClasse)
        if (classe.numVagas == 0) {
            req.flash('error_msg', 'Não ha mais vaga neste Curso')
            res.redirect('/turmas/turma/' + idTurma)
        } else {
            candidato.idTurma = idTurma
            candidato.idClasse = classe._id
            candidato.idCurso = classe.idCurso
            candidato.idAno = classe.idAno
            res.render("alunos/novaMatricula", { candidato })
        }
    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const saveNovaMatricula = async (req, res) => {
    try {
        const idCandidato = req.body.idCandidato
        const idTurma = req.body.idTurma
        const idClasse = req.body.idClasse
        const idCurso = req.body.idCurso
        const idAno = req.body.idAno

        const bi = req.body.numBI
        const veryBICand = await findCandByNumBIService(bi)
        const veryBI = await findAlunoByBIService(bi)
        const candidato = req.body;
        //candidato._id = req.params.id
        const erros = []
        if (veryBICand.numBI != req.body.numBI) {
            return res.send('O Bi não coreesponde')
            erros.push({ texto: 'O número do BI não corresponde ao aluno admitido!' })

        }
        if (veryBI) {
            return res.send('Já existe um registro com este BI')
            erros.push({ texto: "Já existe um registro com este BI" })
        }
        if (veryBICand.curso != req.body.curso) {
            //return res.send('Foste admitido para o curso de ' + veryBICand.curso)
            erros.push({ texto: 'Foste admitido para o curso de ' + veryBICand.curso })
        }
        if (erros.length > 0) {
            res.render('alunos/adAdmintido', { candidato, erros })
        } else {
            //return res.send('O Bi Corresponde, pode matricular')
            /* Criar usuario */
            const turma = await findTurmaByIdService(idTurma)
            const nome = req.body.nome
            const numBilhete = req.body.numBI
            const num = numBilhete.slice(5, 8)
            const nomeArray = nome.split(" ")
            //primeironome@ngungaxxx.turma
            const username0 = nomeArray[0] + '@ngunga' + num + '.' + turma.codigo
            const username = username0.toLocaleLowerCase()
            // return res.send({username})

            const novoUsuario = {
                username: username,
                senha: req.body.numBI,
                telefone: req.body.contacto,
                foto: veryBICand.foto
            }

            const userAluno = await createUserService(novoUsuario)
            const candidatoUp = await findCandByIdService(idCandidato)
            candidatoUp.estado = 'Matriculado'
            await findCandByIdAndUpdateService(idCandidato, candidatoUp)
            const aluno = req.body;
            aluno.usuario = userAluno._id;
            aluno.dataNascimento = candidatoUp.dataNascimento
            aluno.classe = '10ª Classe';
            aluno.foto = veryBICand.foto;

            const novoAluno = await createAlunoService(aluno)
            const classeUpdade = await findClasseByIdService(idClasse)
            classeUpdade.numVagas -= 1
            await findClasseByIdAndUpdate(idClasse, classeUpdade)
            req.flash('success_msg', 'Aluno matriculado com sucesso!')
            res.redirect('/turmas/turma/' + idTurma)

        }


    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}

export const addProfessor = async (req, res) => {
    try {
        const idProfessor = req.body.idProfessor
        const nomeDisciplina = req.body.nomeDisciplina
        const idTurma = req.body.idTurma
        const idClasse = req.body.idClasse
        const idCurso = req.body.idCurso
        const idAno = req.body.idAno

        const professor = await findFuncionariosByIdService(idProfessor)
        //const disciplina = await findDisciplinaByIdService(idDisciplina)
        let exist = ''
        professor.turmas.forEach(element => {
            if (element == idTurma) {
                exist = 'Este professor ja é desta turma!'

            }
        });
        if (exist == '') {
            professor.turmas.push(idTurma)
            professor.disciplinas.push(nomeDisciplina)
            const minipauta = {
                nomeDisciplina: nomeDisciplina,
                idClasse: idClasse,
                idProfessor: professor._id,
                idTurma: idTurma,
                idCurso: idCurso,
                idAno: idAno
            }

            const alunos = await findAlunosByIdTurma(idTurma)
            const alunosMinipauta = []
            alunos.forEach(element => {
                alunosMinipauta.push(element._id)
            });
            minipauta.alunos = alunosMinipauta

            const novaMinipauta = await creatMinipautaService(minipauta)
            const idMinipauta = novaMinipauta._id
            professor.minipautas.push(idMinipauta)
            const profUpdate = await findFuncionarioByIdAndUpdateService(idProfessor, professor)
            //disciplina.idProfessor = professor._id
            //const disciplinaUpdate = await findDisciplinaByIdAndUpdateService(idDisciplina, disciplina)
            // return res.send("Sucesso!")

            req.flash('success_msg', 'Novo professor adicionado!')
            res.redirect('/turmas/pturma/' + idTurma)
        } else {
            req.flash('error_msg', '' + exist)
            res.redirect('/turmas/pturma/' + idTurma)
        }



    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const remProfessor = async (req, res) => {
    try {
        const idProfessor = req.body.idProfessor
        const nomeDisciplina = req.body.nomeDisciplina
        const idTurma = req.body.idTurma
        const idClasse = req.body.idClasse
        const idCurso = req.body.idCurso
        const idAno = req.body.idAno
        
        const turma = await findTurmaByIdService(idTurma)
        const professor = await findFuncionariosByIdService(idProfessor)
        //return res.send({professor})
        //const disciplina = await findDisciplinaByIdService(idDisciplina)
        
        res.render('admin/turmas/remProfessor',{professor, nomeDisciplina, turma})



    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}
export const remProfessorSave = async (req, res) => {
    try {
        const idProfessor = req.body.idProfessor
        const nomeDisciplina = req.body.nomeDisciplina
        const idTurma = req.body.idTurma
        const idClasse = req.body.idClasse
        const idCurso = req.body.idCurso
        const idAno = req.body.idAno
        
        const professor = await findFuncionariosByIdService(idProfessor)
        return res.send({professor})
        //const disciplina = await findDisciplinaByIdService(idDisciplina)
       
        if (exist == '') {
            professor.turmas.push(idTurma)
            professor.disciplinas.push(nomeDisciplina)
            const minipauta = {
                nomeDisciplina: nomeDisciplina,
                idClasse: idClasse,
                idProfessor: professor._id,
                idTurma: idTurma,
                idCurso: idCurso,
                idAno: idAno
            }

            const alunos = await findAlunosByIdTurma(idTurma)
            const alunosMinipauta = []
            alunos.forEach(element => {
                alunosMinipauta.push(element._id)
            });
            minipauta.alunos = alunosMinipauta

            const novaMinipauta = await creatMinipautaService(minipauta)
            const idMinipauta = novaMinipauta._id
            professor.minipautas.push(idMinipauta)
            const profUpdate = await findFuncionarioByIdAndUpdateService(idProfessor, professor)
            //disciplina.idProfessor = professor._id
            //const disciplinaUpdate = await findDisciplinaByIdAndUpdateService(idDisciplina, disciplina)
            // return res.send("Sucesso!")

            req.flash('success_msg', 'Novo professor adicionado!')
            res.redirect('/turmas/pturma/' + idTurma)
        } else {
            req.flash('error_msg', '' + exist)
            res.redirect('/turmas/pturma/' + idTurma)
        }



    } catch (error) {
        res.status(500).send({ mesage: error.mesage })
    }
}