import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Aluno = new Schema({
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
        required: true,
        default: Date.now()
    },
    foto: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    curso: {
        type: String,
        required: true
    },
    pai: {
        type: String,
        required: true
    },
    mae: {
        type: String,
        required: true
    },
    escolaAnt: {
        type: String,
        required: true
    },
    morada: {
        type: String,
        required: true
    },
    nomeEncarregado: {
        type: String,
        required: true
    },
    proficao: {
        type: String,
        default: '',
        require: true
    },
    contactoEncarregado: {
        type: String,
        default: '',
        require: true
    },
      usuario: {
         type: Schema.Types.ObjectId,
         ref: "users",
         require: true
     },
     disciplinas: {
         type: Array,
         require: true
     },
     classe: {
         type: String,
         require: true
     },
     matricula: {
         type: String,
         default: 'Não confirmada'
     }, 
     idTurma: {
         type: String,
         require: true
     }, 
     idClasse: {
         type: String,
         require: true
     }, 
     idCurso: {
         type: String,
         require: true
     }, 
     idAno: {
         type: String,
         require: true
     },
     faltas: {
        type: Number,
        require: true
    }, 
     idProfessor: {
        type: String,
        require: true
    }, 
     concluido: {
        type: String,
        require: true
    } 
     
})


const aluno  = mongoose.model("alunos", Aluno)
export default aluno