const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here
app.get('/mario', async(req,res) => {
    res.send(await marioModel.find());
});

app.get('/mario/:id', async(req,res) => {
    const id = req.params.id;
    try {
        res.send(await marioModel.findById(id));
    }
    catch(e) {
        res.status(400).send({message: e.message});
    }
});

const isNullOrUndefined = vol => vol === null || vol === undefined;

app.post('/mario', async(req,res) => {
    const newMario = req.body
    if(isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)) {
        res.status(400).send({message: 'either name or weight is missing'});
    } else {
        const newMariodocument = new marioModel(newMario);
        await newMariodocument.save();
        res.send(newMariodocument);
    }
});

app.patch('/mario/:id', async(req,res) => {
    const id = req.body
    const newMario = req.body;
    try {
    const existingMarioDoc = await marioModel.findById(id);
    if(isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)) {
        res.status(400).send({message: 'both name and weight is missing'});
    } else{
        if(!isNullOrUndefined(newMario.name)){
            existingMarioDoc.name = newMario.name;
        }
        if(!isNullOrUndefined(newMario.weight)){
            existingMarioDoc.weight = newMario.weight;
        }
        await existingMarioDoc.save();
        res.send(existingMarioDoc);
    }

    } catch(e) {
        res.status(400).send({message: e.message});
    }
});

app.delete('/mario/:id', async(req,res) => {
    const id = req.params.id;
    try {
        const res = await marioModel.findById(id);
        await marioModel.deleteOne({_id: id});
        res.send({message: 'character deleted'});
    }
    catch(e) {
        res.status(400).send({message: e.message});
    }
});

module.exports = app;