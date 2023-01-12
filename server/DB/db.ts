import fs from 'fs';
import { config } from '../envconfig';
import Chat from '../models/Chat';
import User from '../models/User';
const mongoose = require('mongoose');

export async function connectDB() {
  mongoose.set('strictQuery', false);
  mongoose.connect(config.db.host, {
    dbName: 'momstown',
    useNewUrlParser: true,
  });
  createCollection('user');
  createCollection('chat');
}

export const createCollection = (modelName) => {
  if (mongoose.modelNames().includes(modelName)) {
    return mongoose.model(modelName);
  }

  switch (modelName) {
    case 'user':
      new User();
      break;
    case 'chat':
      new Chat();
      break;
  }
};
