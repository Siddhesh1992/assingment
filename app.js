const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transaction');

const app = express();

// 100 request in an hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in a hour',
});
dotenv.config({ path: './config.env' });

app.use(helmet());
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use('/api/auth', userRoutes);
app.use('/api/', transactionRoutes);

app.use(express.static('client/build'));

app.all('*', (req, res, next) => {
  const path = require('path');
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

app.use(globalErrorHandler);

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  });

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1); //0 for success and 1 for uncaught exception
  });
});

//undefined variable or bugs in code
process.on('uncaughtException', (err) => {
  app.close(() => {
    process.exit(1);
  });
});
