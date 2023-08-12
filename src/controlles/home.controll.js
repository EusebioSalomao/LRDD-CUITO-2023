import { findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js"
import { findAllNoticiasService, ultimasInformacoes } from "../services/news.services.js"

export const inicio = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoActivo = await findAnoLectivoByEstadoService(estado)
        let candidaturaAberta = ''
        const informacoes = await ultimasInformacoes()
        
        if(anoActivo != null && anoActivo.candidatura == 'Aberta'){
            //return res.send('Sucesso!')
            candidaturaAberta = 'sim'
            res.render('home/principal', {candidaturaAberta, informacoes})
        }else{
            res.render('home/principal', {informacoes})

        }
        
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const sobreNos = async (req, res) => {
    try {
        res.render('home/sobreNos')
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}