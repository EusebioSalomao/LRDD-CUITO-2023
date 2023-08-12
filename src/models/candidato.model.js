import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Candidato = new Schema({
    nome: {
        type: String,
        required: true
    },
    numBI: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    foto: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        require: true
    },
    genero: {
        type: String,
        required: true
    },
    contacto: {
        type: String,
        require: true
    },
    
    escolaAnterior: {
        type: String,
        default: ''
    },
    curso: {
        type: String,
        required: true
    },
    certificado: {
        type: String,
        default: ''
    },
    emolumento: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        default: 'Inscrito'
    }
    
})


const candidato  = mongoose.model("candidatos", Candidato)
export default candidato