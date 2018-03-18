const {Genre} = require('./genre');

const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

// validate the document
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    },
    genre: {
        type: genreSchema, 
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);

// validate the content of the request
function validateMovie(movie) {
    const schema = {        
        title: Joi.string().min(1).required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0),
        genreId: Joi.string().required()
    };
    return Joi.validate(movie, schema);
};

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
module.exports.movieSchema = movieSchema;