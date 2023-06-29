/* eslint-disable linebreak-style */
/* eslint-disable indent */

const express = require('express');
const users = require('./users');
const cards = require('./cards');

const router = express.Router();

router
  .use('/users', users)
  .use('/cards', cards)
  .use((req, res) => {
    res.status(404).send({ message: 'Страница не найдена' });
});
module.exports = router;
