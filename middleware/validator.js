const { body } = require('express-validator');
const User = require('../models/user');

exports.loginValidator = [
  body('email').not().isEmpty().trim().escape(),
  body('password').not().isEmpty().trim().escape(),
];

exports.signUpValidator = [
  body('email')
    .isEmail()
    .withMessage('Invalid Email')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      if (await User.exists({ email: value })) {
        throw new Error('Email already Exists');
      }

      return true;
    }),
  body('name').not().isEmpty().trim().escape(),
  body('password').not().isEmpty().trim().escape(),
];

exports.transactionValidator = [
  body('customerName').not().isEmpty().trim().escape(),
  body('description').not().isEmpty().trim().escape(),
  body('type').not().isEmpty().trim().escape(),
  body('amount').not().isEmpty().escape().toInt(),
];

exports.transactionUpdateValidator = [
  body('customerName').not().isEmpty().trim().escape(),
  body('description').not().isEmpty().trim().escape(),
  body('type').not().isEmpty().trim().escape(),
  body('amount').not().isEmpty().escape().toInt(),
];
