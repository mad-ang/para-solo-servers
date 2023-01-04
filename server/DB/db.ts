import fs from 'fs'

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
