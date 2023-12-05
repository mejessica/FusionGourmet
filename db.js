const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/dbReceitas')
    .then(() => {
        console.log("conexão estabelecida com sucesso")
    })
    .catch(err => {
        console.log("erro ao conectar com o banco"+err)
    })

    module.exports = mongoose