const Joi = require('joi');
const mongoose = require('mongoose');

// define schema for db
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);


function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(2).required()
    };
    return Joi.validate(genre, schema);
};

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;