const express = require('express');
const app = express();
app.use(express.json());
const Joi = require('joi');

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
    res.send(req.params.genre);  //req.params.genre
    console.log('send genre: ' + req.params.genre);
});

// CREATE / POST
app.post('/api/genres', (req, res) => {
    console.log(req.body);
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
app.put('/api/genres', (req, res) => {

});

// DELETE / DELETE
app.delete('/api/genres', (req, res) => {

});

function validateGenre(genre) {
    const schema = {
        genre: Joi.string().min(2).required()
    };
    return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));