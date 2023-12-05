const express = require("express")
const axios = require("axios")
const ejs = require("ejs")
const app = express()
const path = require("path")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const expressSession = require("express-session")
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
const Receita = require('./models/receita')
const User = require('./models/user')

const key_api = "a51430a6da564c96be47ca64a0955a66"

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))
app.use(expressSession({
    secret: "infoProfile", resave: false, saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

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

// app.post("/recipe/:id", async (req, res) => {
//     const {id} = req.params
//     const recipes = response.datas.results
//     for (item of recipes.items) {
//         if (item.id == id) {
//             const recipe = item.query
//             const recipeFav = await Receita.find({query: recipe.query})
//             if (recipeFav.length == 0) {
//                 const newRecipe = new Receita({query: recipe.query})
//                 await newRecipe.save()
//                 console.log("Receita salva!")
//             } else {
//                 console.log("A receita já está nas suas favoritas!")
//             }
//         }
//     }    
// })

//login and register

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            res.render("register")
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/login")
            })
        }
    })
})

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

app.get('/infoProfile', async (req, res) => {
    const recipe = await Receita.find({})
    res.render('recipes/infoProfile', { recipe })
})

app.get('/login', isLoggedIn, (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        res.redirect('/infoProfile')
    })

app.get("/logout", (req, res) => {
    req.logOut(() => {
        console.log("Sessão encerrada")
    })
    res.redirect('/')
})

//add fav no banco

// app.post('/recipe/:id', async (req, res) => {
//     const { id } = req.params
//     if(recipe.totalRecipes > 0){
//         for(recipe of recipe.recipes){
//             if(recipe.id == id){
//                 const recipe = response.datas.results
//                 const receitaFavoritada = await Receita.find({ title: recipe.title })
//                 if(receitaFavoritada.length == 0){
//                     const novaFavorita = new Receita({title: recipe.title})
//                     await novaFavorita.save()
//                     res.send("Receita salva!")
//                 } else{
//                     res.send("Receita já está salva na lista de favoritos.")
//                 }
//             }
//         }

//     }

// })
app.post('/infoProfile/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key_api}`);
        const recipe = response.data;

        if (recipe.id == id) {
            const receitaFavoritada = await Receita.find({title: recipe.title });

            if (receitaFavoritada.length === 0) {
                const novaFavorita = new Receita({ title: recipe.title, id:recipe.id });
                await novaFavorita.save();
                console.log("Receita salva!");
            } else {
                console.log("Receita já está salva na lista de favoritos.");
            }
        } else {
            res.status(404).console.log("Receita não encontrada.");
        }
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        res.status(500).console.log("Erro interno do servidor ao salvar a receita.");
    }
    
});


app.get('/infoProfile/:id', async (req, res) => {
    const { id } = req.params
    const recipe = await Receita.findOne({ id: id });
    if (recipe) {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${key_api}`)
        const recipe = response.data;
        res.render('recipes/show', { recipe })
    } else
        console.log('A receita não foi encontrada.')
})

app.delete('/infoProfile/:id', async (req, res) => {
    const { id } = req.params
    await Receita.findOneAndDelete({ id: id })
    res.redirect('/infoProfile')
})

app.listen(3000, () => {
    console.log("servidor ligado na porta 3000")
})