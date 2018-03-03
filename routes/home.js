const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.render('index', { title: "My express App", message: 'Hello from ExpressWorld' });
    console.log('@Root: Client connected.');
});

module.exports = router;
