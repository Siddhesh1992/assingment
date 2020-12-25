const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Transaction = require('./../models/transaction');
const { validationResult } = require('express-validator');
const moment = require('moment');

exports.getTrans = catchAsync(async (req, res) => {
  if (req.params && req.params.transId) {
    const trans = await Transaction.findOne({ _id: req.params.transId });
    return res.status(200).send(trans);
  }

  const trans = Transaction.find({ user: req.user._id });

  if (req.query && req.query.fromDate && req.query.toDate) {
    const fromDate = moment(req.query.fromDate, 'DD-MM-YYYY').toDate();
    const toDate = moment(req.query.toDate, 'DD-MM-YYYY').toDate();

    trans.where({
      createdAt: {
        $gte: fromDate,
        $lt: toDate,
      },
    });
  }

  console.log(trans.getFilter());

  res.status(200).send(await trans);
});

exports.createTrans = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation Error', 422, errors.array()));
  }

  await Transaction.create({ user: req.user._id, ...req.body });

  return res.status(201).send({
    status: 'Success',
    message: 'Transaction Created',
  });
});

exports.updateTrans = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation Error', 422, errors.array()));
  }

  await Transaction.findByIdAndUpdate(req.body.transId, req.body);

  return res.status(200).send({
    status: 'Success',
    message: 'Transaction Updated',
  });
});

exports.deleteTrans = catchAsync(async (req, res) => {
  const trans = await Transaction.findByIdAndUpdate(req.body.transId, {
    active: false,
  });

  return res
    .status(200)
    .send({ status: 'Success', message: 'Deleted Successfully' });
});
