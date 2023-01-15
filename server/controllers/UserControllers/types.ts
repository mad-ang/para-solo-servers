export type Token = string

export interface IUser {
  userId: string
  password: string
  username?: string
  profileImgUrl: string
  heigth: number
  weight: number
  region: string
  sex: sex
  age: number
  refreshToken?: Token | null
  createdAt: Date | null
  lastUpdated: Date | null
}

enum sex {
  FEMALE,
  MALE
}
