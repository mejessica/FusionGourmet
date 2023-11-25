const express = require("express")
const request = require("request")
const axios = require("axios")
const ejs = require("ejs")
const app = express()
const path = require("path")

const key_api = "d62185cdf2fa4e5c90a34f61cdf2c437"

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const responseVegetarian = await axios.get(` https://api.spoonacular.com/recipes/random?number=4&tags=vegetarian&apiKey=${key_api}`)
    const vegetarianRecipes = responseVegetarian.data.recipes;

    const responseCake = await axios.get(` https://api.spoonacular.com/recipes/random?number=4&tags=breakfast&apiKey=${key_api}`)
    const cakeRecipes = responseCake.data.recipes;


    res.render('home', { cakeRecipes, vegetarianRecipes })
})
app.get('/search', (req, res) => {
    res.render('results')
})

app.post('/search', async (req, res) => {

    const { query } = req.body;
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${key_api}`)
    const recipes = response.data.results;
    res.render('results', { recipes })
})


app.get('/recipe/:id', async (req, res) => {
    const { id } = req.params;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key_api}`)
    const recipe = response.data;
    res.render('recipe', { recipe })
})

app.get('/perfil', (req, res) => {
    res.render('profile')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/infoProfile', (req, res) => {
    res.render('infoProfile')
})

app.listen(3000, () => {
    console.log("servidor ligado na porta 3000")
})