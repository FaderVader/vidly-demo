const mongoose = require('mongoose');
const Joi = require('joi');
const {userSchema, User} = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    res.send('Nothing here');
});


router.post('/', async (req, res) => {
    const {error} = validate(req.body);    
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid login');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid login');
    
    const token = user.generateAuthToken(); 
    res.send(token);
});


router.put('/:id', async (req, res) => {
    res.send('Nothing here');
});


router.delete('/:id', async (req, res) => {
    res.send('Nothing here');
});


function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;