const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Customer = require('./models/db')
const { json } = require('body-parser')
const db = require('./models/db')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended: true}))

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('returnOriginal', false)

mongoose.connect('mongodb://localhost:27017/banking')
    .then(() => {
        console.log("Connected to the database...")
    })
    .catch(err => {
        console.log("Error !!")
        console.log(err)
    })



let senderId = ''
let recieverId = ''

app.get('/', (req,res) => {
    res.render('front')
})

app.get('/home', (req,res) => {
    res.render('home')
})
app.get('/customers', (req,res) => {
    Customer.find({}, (err, allCustomers) => {
        if(err){
            console.log(err)
        }else {
             res.render('customers',{customers: allCustomers})
            
        }
    })
})

app.get('/customers/:id', (req,res) => {
    senderId = req.params.id
    Customer.findById(req.params.id).exec({}, (err, foundCustomer) => {
        if(err) {
            console.log(err)
        }else{
            res.render('show', {customer: foundCustomer})
        }
    })
})

app.get('/transfer', (req,res) => {
    Customer.find({}, (err, allCustomers) => {
        if(err){
            console.log(err)
        }else {
             res.render('transfer',{customers: allCustomers})
            
        }
    })
})


app.get('/transfer/:id', (req,res) => {
    recieverId = req.params.id
    Customer.findById(req.params.id).exec({}, (err, foundCustomer) => {
        if(err) {
            console.log(err)
        }else{
            res.render('checkout', {customer: foundCustomer})
        }
    })
})
 
app.post('/transfer', (req,res) => {
    const amount = req.body.amount
    Customer.findById(senderId).exec({}, (err, sender) => {
        if(err){
            console.log(err)
        }else{
            if(sender.balance < amount) {
                res.render('fail')
            }else{
                const newSenderBalance= sender.balance - amount
                sender.balance = newSenderBalance
                sender.save()   
            } 
        }
    })
    Customer.findById(recieverId).exec({}, (err, reciever) => {
        if(err){
            console.log(err)
        }else{
            const newRecieverBalance= parseInt(reciever.balance) + parseInt(amount)
            reciever.balance = newRecieverBalance
            reciever.save()   
        }
    })
    res.render('success')
})



app.get('*', (req,res) => {
    res.render('fail')
})

app.listen(4590, ()=>{
    console.log('Server running on http://localhost:4590')
})