const express = require('express');
const router = express.Router();
// expected base-route: /api/genres

var genres = [
    {id: 1, genre: 'horror'},
    {id: 2, genre: 'sci-fi'},
    {id: 3, genre: 'documentary'},
    {id: 4, genre: 'comedy'},
];

// READ / GET
router.get('/', (request, response) => { 
    response.send(genres);   
    console.log('Client connected.');
   });


router.get('/:genre', (req, res) => { 
    let genre = genres.find(g => g.genre === req.params.genre) ;
    if (!genre) return res.status(404).send('Genre not found');
    res.send(req.params.genre); 
    console.log('send genre: ' + req.params.genre);
});

// CREATE / POST
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {    
    let updatedGenre = genres.find(g => g.id === parseInt(req.params.id));
    if (!updatedGenre) return res.status(404).send("Genre not found");

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    updatedGenre.genre = req.body.genre;
    res.send(updatedGenre);
});

// DELETE / DELETE
router.delete('/:id', (req, res) => {
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
};

module.exports = router;