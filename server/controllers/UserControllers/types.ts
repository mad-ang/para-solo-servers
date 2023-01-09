export type Token = string

export interface IUser {
  userId: string
  password: string
  username?: string
  profileImgUrl?: string | null
  refreshToken?: Token | null
  createdAt: Date | null
  lastUpdated: Date | null
}
