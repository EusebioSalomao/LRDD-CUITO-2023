import Funcionario from '../models/funcionario.modell.js'

export const createFuncionarioService = (funcionario) => Funcionario(funcionario).save()

export const findAllFuncionariosService = () => Funcionario.find().lean()

export const findFuncionariosByIdService = (idF) => Funcionario.findById(idF).lean()

export const findFuncionarioByNumBIService = (numBI) => Funcionario.findOne({numBI: numBI}).lean()

export const findFuncionariosUser = (idUser) => Funcionario.findOne({usuario: idUser}).lean()

export const findFuncionarioByIdAndUpdateService = (idProfessor, professor) => Funcionario.findByIdAndUpdate(idProfessor, professor).lean()

export const findFuncionarioByFuncaoService = (funcao) => Funcionario.find({funcao: funcao}).lean()