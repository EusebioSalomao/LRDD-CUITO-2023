import { createAnoLectivoService, findAllAnosLectivo, findAnoLectivoByCodigo, findAnoLectivoByEstadoService, findAnoLectivoById, findAnoLectivoByIdAndUpdate, findAnoLectivoByIdAndeDeleteService } from "../services/anoLectivo.service.js"
import { findAllClassesByIdCurso } from "../services/classe.service.js"
import { findAllCursosService, findCursoByIdService, findCursosByIdAnoService } from "../services/curso.service.js"


export const allAnosLectivos = async (req, res) => {
    try {
        const anosLectivo = await findAllAnosLectivo()
        anosLectivo.forEach(element => {
            if(element.estado == "Encerrado"){
                element.encerrado = "Encerrado"
            }
        });
        res.render('admin/anoLectivo/tdAnosLectivo', { anosLectivo })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}
export const wAdAnoLectivo = async (req, res) => {
    try {
        res.render('admin/anoLectivo/adAnoLectivo')
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}
export const adAnoLectivo = async (req, res) => {
    try {
        const anoLectivo = req.body
        const codigo = anoLectivo.codigo
        const verifyAno = await findAnoLectivoByCodigo(codigo)
        if (verifyAno) {
            req.flash('error_msg', 'Já existe um ano lectivo com o código '+codigo)
            res.redirect('/anosLectivo/add')
        } else {
            const novoAno = await createAnoLectivoService(anoLectivo)
            req.flash('success_msg', 'Novo ano cadastrado!')
            res.redirect('/anosLectivo')
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const deletarAnoLectivo = async (req, res) => {
    try {
        const idAno = req.body.idAno
        const anoDeletado = await findAnoLectivoByIdAndeDeleteService(idAno)
        const nome = anoDeletado.codigo
        req.flash('error_msg', 'Ano lectivo '+nome+' apagado!')
        res.redirect('/anosLectivo')
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const wConfigAnoLectivo = async (req, res) => {
    try {
        const user = req.user
        let eAdmin = ''
        if(user.eAdmin){
            eAdmin = 'Sim'
        }
        //return res.send({user})
        const idAno = req.params.id
        const anoLectivo = await findAnoLectivoById(idAno)
        let candidaturaAberta = ''
        if(anoLectivo.candidatura == 'Aberta'){
            candidaturaAberta = 'sim'
        }
        if(anoLectivo.estado == 'Activo'){
            const cursos = await findCursosByIdAnoService(idAno)
            //////////////////////////////////////////////////////////////
            res.render('admin/anoLectivo/configAno', { anoLectivo, cursos, candidaturaAberta, eAdmin })
        }else{
            req.flash('error_msg', 'Este ano não esta activo')
            res.redirect('/anosLectivo')
        }
    } catch (error) {
        res.status(500).send({ message: 'novo:' + error.message })
    }
}

export const activarAnoLectivo = async (req, res) => {
    try {
        const idAno = req.params.id
        const estado = 'Activo'
        const anoLectivo = await findAnoLectivoByEstadoService(estado)
        if(anoLectivo){
            req.flash('error_msg', 'Um ano já esta activo! Encerra o ano Lectivo anterior para activar o outro.')
            res.redirect('/anosLectivo')
        }else{
            const anoLectivoActivar = await findAnoLectivoById(idAno)
            //res.send({anoLectivoActivar})
            anoLectivoActivar.estado = estado
            const codigo = anoLectivoActivar.codigo
            await findAnoLectivoByIdAndUpdate(idAno, anoLectivoActivar)
            req.flash('success_msg', 'Ano Lectivo '+codigo+' activado')
            res.redirect('/anosLectivo')

        }

    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
export const desactivarAnoLectivo = async (req, res) => {
    try {
        const idAno = req.body.idAno
        const estado = 'Encerrado'
        const anoLectivo = await findAnoLectivoById(idAno)
        if(!anoLectivo){
            req.flash('error_msg', 'Ano Lectivo não encontrado')
            res.redirect('/anosLectivo/config/'+idAno)
        }else{
            //res.send('Ainda não existe um ano activo')
            anoLectivo.estado = estado
            const codigo = anoLectivo.codigo
            await findAnoLectivoByIdAndUpdate(idAno, anoLectivo)
            req.flash('success_msg', 'Ano Lectivo '+codigo+' Encerrado!')
            res.redirect('/anosLectivo')

        }

    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const gerirCurso = async (req, res) => {
    try {
        const idCurso = req.body.idCurso

        const idAno = req.body.idAno
        

        const ano = await findAnoLectivoById(idAno)
        const curso = await findCursoByIdService(idCurso)
        const classes = await findAllClassesByIdCurso(idCurso)

        //const anoLectivo = await findAnoLectivoById(idAno)
        // console.log(anoLectivo)
        res.render('admin/cursos/gerirCurso', { curso, ano, classes })
    } catch (error) {
        res.status(500).send({ message: 'novo:' + error.message })
    }
}

export const editAnoLectivo = async (req, res) => {
    try {
        const id = req.params.id
        const anoLectivo = await findAnoLectivoById(id)
        if (anoLectivo) {
            res.render('admin/anoLEctivo/editAnoLectivo', { anoLectivo })
        } else {
            req.flash('error_msg', 'O ano que esta tentando editar não existe')
            res.redirect('/anosLectivo')
        }
    } catch (error) {
        res.status(500).send({ message: 'erro, editAnoLectivo:' + error.message })
    }
}

export const editSave = async (req, res) => {
    try {
        const anoLectivo = req.body
        const id = req.body.id
        const codigo = anoLectivo.codigo
        const verifyAno = await findAnoLectivoByCodigo(codigo)
        if (verifyAno && verifyAno._id != id) {
            req.flash('error_msg', 'Já existe um ano lectivo com o código ' + anoLectivo.codigo)
            res.redirect('/anosLectivo/edit/' + id)
        } else {

            const novoAnoEdit = await findAnoLectivoByIdAndUpdate(id, anoLectivo)
            req.flash('success_msg', 'Ano editado com sucesso!')
            res.redirect('/anosLectivo/')
        }

    } catch (error) {
        res.status(500).send({ message: 'erro, editSave:' + error.message })

    }
}

export const abrirCandidatura = async (req, res) => {
    try {
        const idAno = req.params.id
        const cursos = await findCursosByIdAnoService(idAno)
        const anoLectivo = await findAnoLectivoById(idAno)
        if(cursos == ''){
            req.flash('error_msg', 'Não é possível abrir a candidatura. Não ha curso cadastrado!')
            res.redirect('/anosLectivo/config/'+idAno)
        }else{
            //return res.send('cursos achados!')
            anoLectivo.candidatura = 'Aberta'
            await findAnoLectivoByIdAndUpdate(idAno, anoLectivo)
            req.flash('success_msg', 'Candidaturas para o ano lectivo '+anoLectivo.codigo+' aberta!')
            res.redirect('/anosLectivo/config/'+idAno)
            
        }
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
export const ecerrarCandidatura = async (req, res) => {
    try {
        const idAno = req.params.id
        const anoLectivo = await findAnoLectivoById(idAno)
        
            //return res.send('cursos achados!')
            anoLectivo.candidatura = 'Encerrada'
            await findAnoLectivoByIdAndUpdate(idAno, anoLectivo)
            req.flash('error_msg', 'Candidaturas encerrada!')
            res.redirect('/anosLectivo/config/'+idAno)
            
        
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
