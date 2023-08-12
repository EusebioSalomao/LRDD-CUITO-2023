import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Funcionario = new Schema({
    nome: {
        type: String,
        required: true
    },
    numBI: {
        type: String,
        required: true
    },
    contacto: {
        type: String,
        require: true
    },
    genero: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    idade: {
        type: Number,
        require: true
    },
    foto: {
        type: String,
        require: true
    },
    especialidade: {
        type: String,
        require: true
    },
    morada: {
        type: String,
        required: true
    },
    funcao: {
        type: String,
        default: 'professor',
        required: true
    },
      usuario: {
         type: String,
         require: true
     },
     disciplinas: {
         type: Array,
         require: true
     }, 
     minipautas: {
         type: Array,
         require: true
     }, 
     turmas: {
         type: Array,
         require: true
     },  
     idAno: {
         type: String,
         require: true
     }, 
     
})


const funcionario  = mongoose.model("funcionarios", Funcionario)
export default funcionario