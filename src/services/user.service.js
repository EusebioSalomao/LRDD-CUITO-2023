
import usuario from '../models/user.modles.js';
import Usuario from '../models/user.modles.js'

export const findByUsernameService = (username) => Usuario.findOne({username: username}).lean();

export const createUserService = (novoUsuario) => Usuario(novoUsuario).save();

export const findAllUsers = () => Usuario.find().lean()

export const findUserBuNameService = (username) => Usuario.findOne({username: username}).lean();

export const findUserByIdService = (id) => Usuario.findById(id).lean()

export const findUserByIdAndDelet = (id) => Usuario.findByIdAndDelete(id)

export const findUserBIdAndUpdate = (id, usuario) => Usuario.findByIdAndUpdate(id, usuario)