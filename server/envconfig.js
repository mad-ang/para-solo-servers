import dotenv from 'dotenv'
dotenv.config()

export const config = {
  jwt: {
    secretKey: process.env.JWT_SECRET,
    expiresInSec: process.env.JWS_EXPIRES_SEC,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
  },
  host: {
    port: parseInt(process.env.DB_HOST),
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  },
}
