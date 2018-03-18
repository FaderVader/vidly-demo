const {Customer} = require('../models/customers')
const {validate} = require('../models/customers')
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
// expected base-route: /api/customers


// READ
router.get('/', async (req, res) =>{
    const customers = await Customer.find().sort('name');
    if (!customers) return res.status(404).send('No results found');
    res.send(customers);
});


// CREATE / POST
router.post('/', async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    newCustomer = await newCustomer.save();
    res.send(newCustomer);
});


// UPDATE / PUT
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold }, { new: true });
    if (!customer) res.status(400).send('customer not found!');

    res.send(customer);
});


// DELETE
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) res.status(404).send('Customer not found');

    res.send(customer);
});

module.exports = router;