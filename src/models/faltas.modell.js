import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Falta = new Schema({
    disciplina: {
        type: String,
        require: true
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: "funcionarios",
        require: true
    },
    aluno: {
        type: Schema.Types.ObjectId,
        ref: "alunos",
        require: true
    },
    faltas: {
        type: Array,
        require: true
    }
    
})


const falta  = mongoose.model("faltas", Falta)
export default falta