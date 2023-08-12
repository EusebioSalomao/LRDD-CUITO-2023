import Pauta from "../models/pauta.modell.js"

export const findAllPautasService = () => Pauta.find().lean()

export const createPautaService = (pauta) => Pauta(pauta).save()

export const findPautasByIdAnoService = (idAno) => Pauta.find({idAno: idAno}).lean().populate("classe").populate("turma").populate("curso")

export const findPautaByIdService = (idPauta) => Pauta.findById(idPauta).lean().populate("turma").populate("classe").populate("curso")

export const findPautaByIdTurma = (idTurma) => Pauta.find({idTurma: idTurma}).lean()

export const findPautaByTrimestre = (trimestre) => Pauta.findOne({trimestre: trimestre}).lean()

export const findOnePautaByIdTurma = (idTurma) => Pauta.findOne({idTurma: idTurma}).lean()