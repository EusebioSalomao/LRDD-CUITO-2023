import { findAlunoByNumBIService } from "../services/aluno.service.js"
import { findAnoLectivoByEstadoService } from "../services/anoLectivo.service.js"
import { addReceitaService } from "../services/financas.service.js"
import { findAllNoticiasService, findByIdService } from "../services/news.services.js"
import { creaOcorrenciaService, findAllOcorrenciasService, findOcorrenciaByEstatoService, findOcorrenciaByIdAndUpdateServece, findSolicitacaoByIdService } from "../services/ocorrencias.service.js"
import { findTurmasByIdAno } from "../services/turma.service.js"


export const homeSecret = async (req, res) => {
    try {
        const novasSolicitacoes = await findOcorrenciaByEstatoService('novaSolicitação')
        res.render('secretaria/homeSecre', {novasSolicitacoes})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
export const novasSolicitacoes = async (req, res) => {
    try {
        const novasSolicitacoes = await findOcorrenciaByEstatoService('novaSolicitação')
        res.render('secretaria/novasSolicitacoes', {novasSolicitacoes})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const aceitarSolicitacao = async (req, res) =>{
    try {
        const solicitacao = req.body
        const ocorrencia = await findSolicitacaoByIdService(solicitacao.idSolic)
        ocorrencia.estado = 'Pendente'
        await findOcorrenciaByIdAndUpdateServece(solicitacao.idSolic, ocorrencia)

        let valorR = 0
        if(req.body.tipo == "Pedido de Certificado"){
            valorR = 1000
            const novaReceita = {
                descricao: ocorrencia.tipoOcorrencia,
                qt: 1,
                valor: valorR,
               // funcionario: 'secretario'
            }
    
            await addReceitaService(novaReceita)
        }
        if(req.body.tipo == "Pedido de Declaração"){
            valorR = 500
            const novaReceita = {
                descricao: ocorrencia.tipoOcorrencia,
                qt: 1,
                valor: valorR,
               // funcionario: 'secretario'
            }
    
            await addReceitaService(novaReceita)
        }
        
        if(req.body.tipo == "Justificação de faltas"){
            valorR = 300
            const novaReceita = {
                descricao: ocorrencia.tipoOcorrencia,
                qt: 1,
                valor: valorR,
               // funcionario: 'secretario'
            }
    
            await addReceitaService(novaReceita)
        }

        await addReceitaService(novaReceita)
        //return res.send({novaReceita})
        req.flash('success_msg', 'Solicitação aceite')
        res.redirect('/secretaria/novasSolicitacoes')
        
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const ocorrencias = async (req, res) => {
    try {
        const tdOcorrencias = await findAllOcorrenciasService()
        const ocorrencias = []
        tdOcorrencias.forEach(element => {
            if(element.estado == 'Pendente'){
                ocorrencias.push(element)
            }
        });
        //return res.send({ocorrencias})
        res.render('secretaria/ocorrencias', {ocorrencias})
    } catch (error) {
        res.status(500).send({mesag: error.mesage})
    }
}

export const novaOcorrencia = async (req, res) => {
    try {
        const estado = 'Activo'
        const anoActivo = await findAnoLectivoByEstadoService(estado)
        const idAno = anoActivo._id
        if(req.body.tipo == "emicaoDeCertif"){
            const tipoCer = 'Pedido de Certificado'
            res.render('secretaria/registrarOcorrencia', {tipoCer})
        }
        if(req.body.tipo == "emicaoDeDec"){
            const tipoDc = 'Pedido de Declaração'
            
            const turmas = await findTurmasByIdAno(idAno)
            res.render('secretaria/registrarOcorrencia', {tipoDc})
        }
        
        if(req.body.tipo == "justficativo"){
            //return res.send('Teste...')
            const tipoJust = 'Justificação de faltas'
            
            const turmas = await findTurmasByIdAno(idAno)
            //return res.send({turmas}) 
            res.render('secretaria/registrarOcorrencia', {tipoJust, turmas})
        }
        if(req.body.tipo == "recepcaoDoc"){
            const recepcaoDoc = 'Recepção de documento'
           
            const turmas = await findTurmasByIdAno(idAno)
            //return res.send({turmas}) 
            res.render('secretaria/registrarOcorrencia', {recepcaoDoc})
        }
        
    } catch (error) {
        res.status(500).send({mesag: error.mesage})
    }
}

export const servicos = async (req, res) => {
    try {
        res.render('secretaria/servicos')
    } catch (error) {
        res.status(500).send({mesag: error.mesage})
    }
}
export const servicosInfo = async (req, res) => {
    try {
        res.render('secretaria/servicosInfo')
    } catch (error) {
        res.status(500).send({mesag: error.mesage})
    }
}

export const enviarSolicitacao = async (req, res) => {
    try {
        //return res.send(req.file.filename)
        const oc = req.body
        if(oc.tipo == 'Recepção de documento'){
            const ocorrencia = {
                descricao: oc.desc,
                emissor: req.body.emissor,
                origem: req.body.origem,
                //copOcorrencia: req.file.filename,
                estado: 'Recebido'
            }
            //return res.send({ocorrencia})
            const ocSave = await creaOcorrenciaService(ocorrencia)
            req.flash('success_msg', 'Registrado com sucesso!')
            res.redirect('/secretaria/ocorrencias')
        }else{
            const numBI = req.body.numBI
            const aluno = await findAlunoByNumBIService(numBI)
            if(aluno){

                //return res.send({aluno})
                
                const ocorrencia = {
                    descricao: req.body.descricao,
                    nomeDoSolicitante: req.body.nomeDoSolicitante,
                    numBI: req.body.numBI,
                    turma: req.body.turma,
                    numfaltas: req.body.numfaltas,
                    disciplina: req.body.disciplina,
                    dataFalta: req.body.dataFalta,
                    estado: 'Pendente'
                }
                //return res.send({ocorrencia})
                const turma = req.body.turma
                
                if(turma == "0"){
                    req.flash('error_msg','Erro! A turma não foi selecinada')
                    res.redirect('/secretaria/ocorrencias')
                }else{
                    
                    const ocorrenciaCriada = await creaOcorrenciaService(ocorrencia)
                    req.flash('success_msg', 'Solicitação registrada com sucesso!')
                    res.redirect('/secretaria/ocorrencias')
                    
                }
            }else{
                //return res.send('Número do bilhete invalido!')
                req.flash('error_msg','Erro! Número do bilhete invalido!')
                res.redirect('/secretaria/ocorrencias')
            }
        
    }
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const detalheOcorrencia = async (req, res) => {
    try {
        const idOc = req.params.id
        const ocorrencia = await findSolicitacaoByIdService(idOc)
        //res.send({ocorrencia})
        res.render('secretaria/detalheOcorr', {ocorrencia})
    } catch (error) {
        res.status(500).send({mesag: error.mesage})
    }
}
export const detalheSolic = async (req, res) => {
    try {
        const idOc = req.params.id
        const ocorrencia = await findSolicitacaoByIdService(idOc)
        //res.send({ocorrencia})
        res.render('secretaria/detalheSolic', {ocorrencia})
    } catch (error) {
        res.status(500).send({mesag: error.mesage})
    }
}

export const gerirInformacoes = async (req, res) => {
    try {
        const informacoes = await findAllNoticiasService()
        res.render('secretaria/informacoes', {informacoes})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}

export const detalheNoticia = async (req, res) => {
    try {
        const idNot = req.params.id
        const informacao = await findByIdService(idNot)
        res.render('secretaria/detalheInfo', {informacao})
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}
export const informase = async (req, res) => {
    try {
        
        res.render('secretaria/informaAqui')
    } catch (error) {
        res.status(500).send({mesage: error.mesage})
    }
}