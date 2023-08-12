import Candidato from '../models/candidato.model.js'
import Curso from '../models/curso.model.js'
import AnoLectivo from '../models/anoLectivo.model.js'

export const findAllCandidatosService = () => Candidato.find().lean()

export const saveCandidatoService = (candidato) => Candidato(candidato).save()

export const findCandByNumBIService = (bi) => Candidato.findOne({numBI: bi}).lean()

export const findCandByIdService = (id) => Candidato.findById(id).lean()

export const updateCandService = (id, candidato) => Candidato.findByIdAndUpdate(id, candidato)

export const findCandByIdAndDeleteService = (id) => Candidato.findByIdAndDelete(id)

export const findCandByIdAndUpdateService = (id, candidato) => Candidato.findByIdAndUpdate(id, candidato).lean()

export const findAllCandidatosByCursoService = (desc) => Candidato.find({curso: desc}).lean()