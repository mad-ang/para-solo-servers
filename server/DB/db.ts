import fs from 'fs'
import { config } from '../envconfig'
import SQ from 'sequelize'

<<<<<<< Updated upstream
const { host, user, database, password } = config.db
export const sequelize = new SQ.Sequelize(database!, user!, password!, {
  host,
  dialect: 'mysql',
  logging: false,
})

// export const userDB = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'))

type ROOM_DB_TYPE = {
  rooms: {
    [roomId: string]: {
      userCnt: number
    }
  }
=======
export async function connectDB() {
  mongoose.set('strictQuery', false);
  mongoose.connect(config.db.host, {
    dbName: 'momstown',
    useNewUrlParser: true,
  });
  createCollection('user');
  createCollection('chat');
>>>>>>> Stashed changes
}

//  TODO: 이름 교체
export const userDB: ROOM_DB_TYPE = {
  rooms: {},
}

<<<<<<< Updated upstream
// export async function connectDB() {
//   mongoose.set('strictQuery', false)
//   return mongoose.connect(config.db.host, {
//     dbName: 'momstown',
//     useNewUrlParser: true,
//   })
// }
=======
  switch (modelName) {
    case 'user':
      new User();
      break;
    case 'chat':
      new Chat();
      break;
  }
};

// export const createChatCollection = (chatroomName) => {
//   if (mongoose.modelNames().includes(chatroomName)) {
//     return mongoose.model(chatroomName)
//   }
//   let chatRoom = new Chat();
//   chatRoom.setChatRoomId
// }
>>>>>>> Stashed changes
