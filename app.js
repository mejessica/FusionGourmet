const express = require("express")
const request = require("request")
const axios = require("axios")
const ejs = require("ejs")
const app = express()
const path = require("path")

const key_api = "a51430a6da564c96be47ca64a0955a66"

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/search', async(req, res) => {

   const {query} = req.body;
   const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${key_api}`)
   const recipes = response.data.results;
   res.render('results', {recipes})
})


app.get('/recipe/:id', async(req,res)=>{
    const {id} = req.params;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key_api}`)
    const recipe = response.data;
    res.render('recipe',{recipe})
})



app.listen(3000, () => {
    console.log("servidor ligado na porta 3000")
})