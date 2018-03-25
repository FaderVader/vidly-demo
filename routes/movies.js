const mongoose = require('mongoose') ;
const {Movie, validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');

const express = require('express');
const router = express.Router();
// expected base-route: /api/movies

// READ
router.get('/',async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req,res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');

    res.send(movie);
})

// CREATE
router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Genre not found');

    const newMovie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await newMovie.save();
    res.send(newMovie);
});

// UPDATE 
router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log('GenreId: ', req.body.genreId);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre not found');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            daylyRentalRate: req.body.dailyRentalRate
        },
        { new: true });
    if (!movie) return res.status(404).send('Movie not found');

    res.send(movie);
});

// DELETE
router.delete('/:id', async (req, res) => {
    const result = Movie.findByIdAndRemove(req.params.id);
    if (!result) return res.status(404).send('Movie not found');

    res.send(result);
});

module.exports = router;