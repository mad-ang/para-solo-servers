export type Token = string

export interface IUser {
  userId: string
  password: string
  username?: string
  profileImgUrl?: string | null
  // 키
  // 몸무게
  // 사는 곳
  // 성별 
  // 나이
  refreshToken?: Token | null
  createdAt: Date | null
  lastUpdated: Date | null
}
