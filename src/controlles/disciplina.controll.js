import { findAnoLectivoById } from "../services/anoLectivo.service.js"
import { findClasseByIdService } from "../services/classe.service.js"
import { findCursoByIdService } from "../services/curso.service.js"
import { createDisciplinaService, findAllDiscplinasService } from "../services/disciplina.service.js"
import { findTurmasByIdClassedService } from "../services/turma.service.js"

export const tdDisciplina = async (req, res) => {
    try {
        const disciplinas = await findAllDiscplinasService()
        return res.send({disciplinas})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const addDisciplina = async (req, res) => {
    try {
        const disciplina = req.body

        const idAno = req.body.idAno
        const idCurso = req.body.idCurso
        const idClasse = req.body.idClasse
        
        const verifyDisciplina = await findAllDiscplinasService()
        let exist = ''
        verifyDisciplina.forEach(element => {
            if(element.nomeDisciplina == disciplina.nomeDisciplina && element.idClasse == idClasse){
                exist = 'Esta disciplina ja está cadastrada!'
            }
        });
        const ano = await findAnoLectivoById(idAno)
        const curso = await findCursoByIdService(idCurso)
        const classe = await findClasseByIdService(idClasse)
        const turmas = await findTurmasByIdClassedService(idClasse)
        let msg = ''
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
        if(exist == ''){
            msg = 'Disciplina cadastrada com sucesso!'
            const novaDisciplina = await createDisciplinaService(disciplina)
            res.render('admin/turmas/gerirTurmas', { turmas, ano, classe, curso, classe10, classe11, classe12, msg })
        }else{
            res.render('admin/turmas/gerirTurmas', { turmas, ano, classe, curso, classe10, classe11, classe12, msg, exist })

        }

    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}