const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    customerName: {
      type: String,
      trim: true,
      required: [true, 'Please tell us your Name!'],
    },
    amount: {
      type: Number,
      required: [true, 'Please Enter Amount'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please tell us your Name!'],
    },
    type: {
      type: String,
      enum: {
        values: ['debit', 'credit'],
        message: 'Type is either: Debit or Credit',
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.pre('find', function () {
  this.where({ active: true });
});

module.exports = mongoose.model('transaction', transactionSchema);
