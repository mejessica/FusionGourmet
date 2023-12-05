
const {mongoose} = require ('../db')

const receitaSchema = new mongoose.Schema({
    title: String,
    id: String
})

const Receita = mongoose.model("Receita", receitaSchema)

module.exports = Receita