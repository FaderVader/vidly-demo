const mongoose = require('mongoose');
const {userSchema, User, validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// named authorization, because the process in this context is thusly!
const authorization = require('../middleware/authenticate');

const express = require('express');
const router = express.Router();


router.get('/me', authorization, async (req, res) => {
    // the authorization-middleware supplies the user._id 
    // in the user-object, because it extracted it from the jsonwebtoken.

    const user = await User.findById(req.user._id);
    console.log('User is: ' + user.name);
    res.status(200).send(_.pick(user, ['_id', 'name', 'email']));

});

router.get('/:id', async (req, res) => {
})



router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);    
    if (error) return res.status(400).send(error.details[0].message);

    let newUser = await User.findOne({email: req.body.email});
    if (newUser) return res.status(400).send('Users email already exists');

    newUser = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();

    const token = newUser.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'name', 'email', 'isAdmin']));
});



router.put('/:id', async (req, res) => {
});



router.delete('/:id', async (req, res) => {
});

module.exports = router;