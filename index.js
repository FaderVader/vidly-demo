const express = require('express');
const app = express();
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');

const log = require('./logger');
const auth = require('./authenticate');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(express.static('public'));
app.use(log);
app.use(auth);

if (app.get('env')==='development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled.');
};

var genres = [
    {id: 1, genre: 'horror'},
    {id: 2, genre: 'sci-fi'},
    {id: 3, genre: 'documentary'},
    {id: 4, genre: 'comedy'},
]

app.get('/api/genres', (request, response) => { 
    response.send(genres);
    console.log('Client connected.');
   });

// READ / GET
app.get('/api/genres/:genre', (req, res) => { 
    let genre = genres.find(g => g.genre === req.params.genre) ;
    if (!genre) return res.status(404).send('Genre not found');
    res.send(req.params.genre); 
    console.log('send genre: ' + req.params.genre);
});

// CREATE / POST
app.post('/api/genres', (req, res) => {
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var newGenre = {
        id: genres.length +1,
        genre: req.body.genre
    };

    genres.push(newGenre);
    res.send(newGenre);
});

// UPDATE / PUT
app.put('/api/genres/:id', (req, res) => {    
    let updatedGenre = genres.find(g => g.id === parseInt(req.params.id));
    if (!updatedGenre) return res.status(404).send("Genre not found");

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    updatedGenre.genre = req.body.genre;
    res.send(updatedGenre);
});

// DELETE / DELETE
app.delete('/api/genres/:id', (req, res) => {
    let deleteGenre = genres.find(g => g.id === parseInt(req.params.id));
    if (!deleteGenre) return res.status(404).send('Genre not found');

    const index = genres.indexOf(deleteGenre);
    genres.splice(index);

    res.send(deleteGenre);
});

function validateGenre(genre) {
    const schema = {
        genre: Joi.string().min(2).required()
    };
    return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));