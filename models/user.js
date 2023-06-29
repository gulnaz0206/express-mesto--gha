const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: ({ value }) => `${value} некорректный, попробуйте использовать другой email`,
    },
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    validator: (value) => validator.isAlpha(value),
    message: 'Некорректное имя',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
    validator: (value) => validator.isAlpha(value),
    message: 'Некорректное описание',
  },
  avatar: {
    data: Buffer,
    type: 'String',
    required: true,
    validate: {
      validator: (value) => (validator.isURL(value)),
      message: (value) => `${(value)} некорректный, попробуйте использовать другой url`,
    },
    default: '',
  },
}, { toJSON: { useProjection: true }, toObject: { useProjection: true } });

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      const error = await this.Unauthorized('Неправильно введена почта или пароль');
      throw error;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      const error = new Error('Неправильно введена почта или пароль');
      throw error;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = mongoose.model('users', userSchema);
