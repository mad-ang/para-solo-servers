import fs from 'fs'
import { config } from '../config'
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')

// export const userDB = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'))

type ROOM_DB_TYPE = {
  rooms: {
    [roomId: string]: {
      userCnt: number
    }
  }
}

//  TODO: 이름 교체
export const userDB: ROOM_DB_TYPE = {
  rooms: {},
}

export async function connectDB() {
  mongoose.set('strictQuery', false)
  return mongoose.connect(config.db.host, {
    dbName: 'momstown',
    useNewUrlParser: true,
  })
}
