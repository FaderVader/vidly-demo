const mongoose = require('mongoose');
const {userSchema, User, validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
});

router.get('/:id', async (req, res) => {
})



router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);    
    if (error) return res.status(400).send(error.details[0].message);

    let newUser = await User.findOne({email: req.body.email});
    if (newUser) return res.status(400).send('Users email already exists');

    newUser = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const result = await newUser.save();
    res.send(_.pick(newUser, ['_id', 'name', 'email']));
});



router.put('/:id', async (req, res) => {
});



router.delete('/:id', async (req, res) => {
});

module.exports = router;