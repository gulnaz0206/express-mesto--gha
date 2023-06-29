/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { response } = require('express');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw res.status(500).send({ message: `Произошла ошибка ${err}` });
      } else res.status(404).send({ message: ' Пользователь с таким id не найден' });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then(async (card) => {
      const userId = req.user._id;
      const ownerId = card.owner._id.toString();
      if (ownerId === userId) {
        const element = await Card.findByIdAndDelete(req.params.cardId);
        res.send({ data: element });
      } throw new Error('Нет прав на удаление');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw res.status(404).send({ message: ' Пользователь с таким id не найден' });
      }
      if (err.name === 'DocumentNotFoundError') {
        throw res.status(500).send({ message: `Произошла ошибка ${err}` });
      } else res.status(404).send({ message: ' Пользователь с таким id не найден' });
    })
    .catch(next);
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
  { new: true },
);

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.id } }, // убрать _id из массива
  { new: true },
);

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
