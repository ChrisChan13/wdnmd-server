import mongoose from 'mongoose';

import { MONGO } from '../config';

mongoose.Promise = global.Promise;

mongoose.connect(MONGO.URL, {
  dbName: MONGO.NAME,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', async () => {
  console.log('Connected to mongodb!');
});
db.on('error', (err) => {
  console.log(err);
});
