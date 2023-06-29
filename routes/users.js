const router = require('express').Router();
const {
  findUser,
  updateUser,
  findAllUsers,
  updateAvatar,
  CreateUser,
} = require('../controllers/users');

router.get('/:userId', findUser);
router.get('/', findAllUsers);
router.post('/create', CreateUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
module.exports = router;
