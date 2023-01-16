import fs from 'fs';
import { config } from '../envconfig';
import Chat from '../models/Chat';
import LastChat from '../models/LastChat';
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
  createCollection('lastchat');
}

export const createCollection = (modelName : string) => {
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
    case 'lastchat':
      new LastChat();
      break;
  }
};
