const express = require('express');
const authController = require('../controllers/auth');
const { protect } = require('../middleware/protect');
const {
  loginValidator,
  signUpValidator,
} = require('./../middleware/validator');

const router = express.Router();

router.post('/signup', signUpValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.get('/isLoggedIn', protect, authController.isLoggedIn);
router.get('/logout', authController.logout);

module.exports = router;
