import fs from 'fs'
import { config } from '../envconfig'
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
// import { config } from '../envconfig'
// import SQ from 'sequelize'

// const { host, user, database, password } = config.db
// export const sequelize = new SQ.Sequelize(database!, user!, password!, {
//   host,
//   dialect: 'mysql',
//   logging: false,
// })


export async function connectDB() {
  mongoose.set('strictQuery', false)
  return mongoose.connect(config.db.host, {
    dbName: 'momstown',
    useNewUrlParser: true,
  })
}
