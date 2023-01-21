import { config } from '../envconfig';
import { Schema, model, Document, Model } from 'mongoose';
import { IUserInfo } from '../controllers/UserControllers/types';

const bcrypt = require('bcrypt');
const saltRounds = config.bcrypt.saltRounds;

const user = new Schema<IUserInfo>({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: false },
  userCoin: { type: Number, required: false},
  userProfile: {
    profileImgUrl: { type: String, required: false },
    height: { type: String, required: false },
    weight: { type: String, required: false },
    region: { type: String, required: false },
    gender: { type: String, required: false },
    age: { type: String, required: false },
  },
  refreshToken: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: false },
  lastUpdated: { type: Date, required: false },
});

user.pre('save', function (next) {
  const user = this; // userSchema를 가르킴

  if (user.isModified('password')) {
    // password가 변경될 때만 Hashing 실행
    // genSalt: salt 생성
    bcrypt.genSalt(saltRounds, function (err: any, salt: string) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err: any, hashedPassword: string) {
        // hash의 첫번째 인자: 비밀번호의 Plain Text
        if (err) return next(err);
        user.password = hashedPassword; // 에러없이 성공하면 비밀번호의 Plain Text를 hashedPassword로 교체해줌
        next(); // Hashing이 끝나면 save로 넘어감
      });
    });
  } else {
    // password가 변경되지 않을 때
    next(); // 바로 save로 넘어감
  }
});

const User = model<IUserDocument>('user', user);
// create new User document

export interface IUserDocument extends IUserInfo, Document {}
export interface IUserModel extends Model<IUserDocument> {}
export default User;
