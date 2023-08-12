import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Minipauta = new Schema({
    nomeDisciplina: {
        type: String,
        required: true
    },
    idClasse: {
        type: Schema.Types.ObjectId,
         ref: "classes",
         require: true
    },
    idProfessor: {
        type: Schema.Types.ObjectId,
         ref: "funcionarios",
         require: true
    },
    alunos: {
        type: Array,
        require: true
    },
    idTurma: {
        type: Schema.Types.ObjectId,
         ref: "turmas",
         require: true
    },
    idCurso: {
        type: String,
        required: true
    },
    idAno: {
        type: String,
        required: true
    }
    
})

const minipauta  = mongoose.model("minipautas", Minipauta)
export default minipauta