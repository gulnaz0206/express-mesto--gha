const validator = require('validator');
const User = require('../models/user');

const findUser = (req, res) => {
  if (validator.isMongoId(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user) res.status(200).send({ data: user });
        else {
          res.status(404).send({
            message: ' Пользователь с таким id не найден',
          });
        }
      })
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
  } else {
    res.status(404).send({
      message: ' Пользователь с таким id не найден',
    });
  }
};
const findAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const CreateUser = (req, res) => {
  const { name, about, avatar } = req.body.data;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: `${err}` });
      else res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about,
  })
    .then((user) => (res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ massage: `${err}` });
      else res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  })
    .then((user) => (res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: `${err}` });
      else res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports = {
  findUser, findAllUsers, CreateUser, updateUser, updateAvatar,
};
