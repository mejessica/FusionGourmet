
const {mongoose} = require ('../db')

const receitaSchema = new mongoose.Schema({
    title: String,
    id: String,
    idUser: String
})

const Receita = mongoose.model("Receita", receitaSchema)

module.exports = Receita