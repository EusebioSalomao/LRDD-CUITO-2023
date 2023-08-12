import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
const Schema = mongoose.Schema;

const Usuario = new Schema({
    username: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    foto: {
        type: String,
        require: true
    },
    telefone: {
        type: String,
        default: '930366434'
    },
    eAdmin: {
        type: Number,
        default: 0
    },
    categoria: {
        type: String,
        default: 'aluno'
    }
})

Usuario.pre('save', async function (next){
    this.senha = await bcrypt.hash(this.senha, 10)
    next();
})

const usuario  = mongoose.model("users", Usuario)
export default usuario