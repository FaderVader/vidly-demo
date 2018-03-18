const mongoose = require('mongoose');
const {Movie, movieValidate, movieSchema} = require('../models/movie');
const {Customer, customerValidate, customerSchema} = require('../models/customer');
const {Rental, validateRental ,rentalSchema} = require('../models/rental');

const express = require('express');
const router = express.Router();
// expected base-url: /api/rentals

// GET
router.get('/', async (req,res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});


// POST
router.post('/', async (req, res) => {
    const {error} = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Movie not found');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Customer not found');

    if (movie.numberInStock < 1) return res.status(400).send('No more copies of movie available');

    let rental = new Rental({
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        numberOfDays: req.body.numberOfDays
    });

    rental = await rental.save();

    movie.numberInStock--;
    movie.save();

    res.send(rental);
});


// PUT
router.put('/:id', async (req, res) => {

});

// DELETE
router.delete('/:id', async (req, res)=> {

});

module.exports = router;