const mongoose = require('mongoose');
const {Customer, validate} = require('../models/genre');

const express = require('express');
const router = express.Router();
// expected base-route: /api/genres



// READ / GET
router.get('/', async (request, response) => { 
    const genres = await Genre.find().sort('name');
    response.send(genres);   
    console.log('Client connected.');
   });


router.get('/:id', async (req, res) => { 
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre not found');

    res.send(genre); 
    console.log('send genre: ' + genre);
});

// CREATE / POST
router.post('/', async (req, res) => {
    console.log(req.body.name);
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newGenre = new Genre({ name: req.body.name });

    newGenre = await newGenre.save();
    res.send(newGenre);
});

// UPDATE / PUT
router.put('/:id', async (req, res) => {   
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, 
        { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send("Genre not found");

    res.send(genre);
});

// DELETE / DELETE
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)        
    if (!genre) return res.status(404).send('Genre not found');

    res.send(genre);
});

module.exports = router;