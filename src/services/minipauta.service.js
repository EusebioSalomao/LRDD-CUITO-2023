import Minipauta from "../models/minipauta.modell.js";

export const creatMinipautaService = (minipauta) => Minipauta(minipauta).save()

export const findMinipautasByIdProfessorService = (idProfessor) => Minipauta.find({idProfessor: idProfessor}).lean().populate("idProfessor").populate("idClasse").populate("idTurma")

export const findMinipautaByIdService = (id) => Minipauta.findById(id).lean().populate("idProfessor").populate("idClasse").populate("idTurma")

export const findAllMinipautasService = () => Minipauta.find().lean()

export const findMinipautasByIdAnoService = (idAno) => Minipauta.find({idAno: idAno}).lean().populate('idTurma').populate('idClasse')

export const findMinipautasByIdTurma = (idTurma) => Minipauta.find({idTurma: idTurma}).lean().populate("alunos")