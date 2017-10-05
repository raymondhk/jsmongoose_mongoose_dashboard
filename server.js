const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var session = require('express-session')
const moment = require('moment')
const path = require('path')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({secret: 'thisissecret'}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')


mongoose.connect('mongodb://localhost/wolves')
var WolfSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    color: { type: String, required: true },
    eyes: { type: String, required: true },
    created: { type: Date, default: moment() }
})
mongoose.model('Wolf', WolfSchema)
var Wolf = mongoose.model('Wolf')
mongoose.Promise = global.Promise

app.get('/', (req, res) => {
    Wolf.find({}, (err, wolves) => {
        if(err){
            console.log('something went wrong')
        }
        else{
            console.log('successfully queried quotes')
        }
        res.render('index', {wolves:wolves, moment:moment})
    })
})

app.get('/wolves/new', (req, res) => {
    res.render('new')
})

app.post('/wolves', (req, res) => {
    console.log("post data: " + req.body)
    var wolf = new Wolf({name: req.body.name, color: req.body.color, eyes: req.body.eyes})
    console.log(wolf)
    wolf.save((err) => {
        if(err){
            console.log(err)
            console.log('something went wrong')
            res.render('new', {errors: wolf.errors})
        }
        else {
            console.log('successfully added a wolf!')
            res.redirect('/')
        }
    })
})

app.get('/wolves/edit/:id', (req, res) => {
    let id = req.params.id
    Wolf.find({_id: id}, (err, wolf) => {
        if(err){
            console.log(err)
            console.log('something went wrong')
        }
        else{
            console.log('successfully queried wolf!')
        }
        res.render('edit', {wolf: wolf})
    })
})

app.post('/wolves/:id', (req, res) => {
    let id = req.params.id
    Wolf.findOne({_id: id}, (err, wolf) => {
        if(err){
            console.log(err)
            console.log('something went wrong')
        }
        else{
            console.log('successfully queried wolf!')
        }
        if(req.body.name == ""){
            console.log("empty string")
        }
        else{
            wolf.name = req.body.name
        }
        wolf.color = req.body.color
        wolf.eyes = req.body.eyes
        console.log(wolf)
        wolf.save( (err) => {
            if(err){
                console.log(err)
                console.log('something went wrong')
                res.render('edit', {errors: wolf.errors})
            }
            else {
                console.log('successfully added a wolf!')
                res.redirect('/')
            }
        })
    })
})

app.get('/wolves/destroy/:id', (req, res) => {
    let id = req.params.id
    Wolf.findOneAndRemove({_id: id}, (err, wolf) => {
        if(err){
            console.log(err)
            console.log('something went wrong')
        }
        else{
            console.log('successfully removed wolf!')
        }
        res.redirect('/')
    })
})


app.listen(8000, () => {
    console.log("listening on port 8000")
})