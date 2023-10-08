import Aluno from "../models/aluno.modell.js";

export const findAllAlunosService = () => Aluno.find().lean()

export const createAlunoService = (aluno) => Aluno(aluno).save()

export const findAlunoByBIService = (bi) => Aluno.findOne({numBI: bi}).lean()

export const findAlunosByIdTurma = (idTurma) => Aluno.find({idTurma: idTurma}).sort({nome: 1}).lean()

export const findAlunoByIdService = (idAluno) => Aluno.findOne({_id: idAluno}).populate('usuario').lean()

export const findAlunoByIdUser = (id) => Aluno.findOne({usuario: id}).lean()

export const findAlunosByIdAnoService = (idAno) => Aluno.find({idAno: idAno}).lean()

export const findAlunoByNumBIService = (numBI) => Aluno.findOne({numBI: numBI}).lean()

export const findAlunoAnDeleteSercice = (idAluno) => Aluno.findByIdAndDelete(idAluno)

