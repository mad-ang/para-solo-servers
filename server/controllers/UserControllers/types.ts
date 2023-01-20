export type Token = string;

export interface IUserInfo {
  userId?: string;
  password?: string;
  username?: string;
  userProfile?: IUserProfile;
  refreshToken?: Token | null;
  createdAt?: Date | null;
  lastUpdated?: Date | null;
}

export interface IUserProfile {
  progileImgUrl?: string;
  heigth?: string;
  weight?: string;
  region?: string;
  gender?: string;
  age?: string;
}

// export enum gender {
//   FEMALE,
//   MALE,
// }
