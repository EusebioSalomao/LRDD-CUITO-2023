import { createAlunoService } from "../services/aluno.service.js"
import { findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js"
import { findTurmaByCodigoServece, findTurmaByIdAndDeleteSerice, findTurmaByIdAndUpdService, findTurmaByIdCursoService, findTurmaByIdService } from "../services/turma.service.js"
import { findUserByIdService } from "../services/user.service.js"

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

        const anoActivo = await findAnoLectivoByEstadoService('Activo')
        const idAno = anoActivo._id

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
        await createAlunoService(aluno)
        //return res.send('Sucesso!')

        req.flash('success_msg', 'Aluno adicionado com sucesso!')
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

