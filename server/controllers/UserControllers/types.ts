export type Token = string;

export interface IUserInfo {
  userId?: string
  password?: string
  username?: string
  // profileImgUrl?: string
  // heigth?: number
  // weight?: number
  // region?: string
  // gender?: gender
  // age?: string
  userProfile?: IUserProfile
  refreshToken?: Token | null
  createdAt?: Date | null
  lastUpdated?: Date | null
}

export interface IUserProfile {
  progileImgUrl?: string
  heigth?: number
  weight?: number
  region?: string
  gender?: gender
  age?: string
}

export enum gender {
  FEMALE,
  MALE
}
