import Turma from "../models/turma.modell.js";

export const createTurmaService = (turma) => Turma(turma).save();

export const findTurmaByIdService = (idTurma) => Turma.findOne({_id :idTurma}).lean()

export const findDadosTurmaByIdService = (idTurma) => Turma.findOne({_id :idTurma}).lean().populate('idClasse').populate('idCurso')

export const findAllTurmasService = () => Turma.find().lean()

export const findTurmaByIdCursoService = (idCurso) => Turma.find({idCurso: idCurso}).lean()

export const findTurmasByIdClassedService = (idClasse) => Turma.find({idClasse: idClasse}).lean()

export const findTurmasByIdAno = (idAno) => Turma.find({idAno: idAno}).lean().populate("idClasse").populate('idCurso')

export const findTurmaByIdAndDeleteSerice = (idTurma) => Turma.findByIdAndDelete(idTurma)

export const findTurmaByCodigoServece = (codigo) => Turma.findOne({codigo: codigo}).lean()

export const findTurmaByIdAndUpdService = (idTurma, turmaAActualizar) => Turma.findByIdAndUpdate(idTurma, turmaAActualizar).lean()

