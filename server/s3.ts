import AWS from 'aws-sdk';
import { config } from './envconfig';
const { bucketName, bucketRegion, identityPoolId, accessKeyId, secretAccessKey } = config.aws;

import { v4 as uuidv4 } from 'uuid';
// import { updateUserInfo } from './auth';

class _S3 {
  private bucketName: string | null = null;
  private bucketRegion: string | null = null;
  private identityPoolId: string | null = null;
  private accessKeyId: string | null = null;
  private secretAccessKey: string | null = null;
  private s3: any = null;

  init() {
    // this = S3 화살표함수의 this는 그 상위객체에 바인딩됨 (S3)
    try {
      if (!bucketName || !identityPoolId) throw '환경변수를 확인해주세요';
      this.bucketName = bucketName!;
      this.bucketRegion = bucketRegion!;
      this.identityPoolId = identityPoolId!;
      this.accessKeyId = accessKeyId!;
      this.secretAccessKey = secretAccessKey!;

      AWS.config.update({
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: identityPoolId,
        }),
      });

      this.s3 = new AWS.S3({
        params: { Bucket: bucketName },
        region: bucketRegion,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

// 이미지 한개 업로드
export const addImage = (albumName: string, files: any, next: any) => {
  if (!files || files.length === 0) {
    return alert('이미지를 선택해주세요.');
  }

  // const file = files[0];
  // const originalFileName = file.name;
  // const originalFiletype = file.type.split('/')[1];
  // const fileName = uuidv4();
  // const albumPhotoKey = encodeURIComponent(albumName);
  // const photoKey = `${albumPhotoKey}/${fileName}.${originalFiletype}`;
  // const params = {
  //   Key: photoKey,
  //   Bucket: bucketName,
  //   Body: file,
  //   ContentType: 'image/jpeg',
  //   ACL: 'public-read',
  // };

  // s3.upload(params, function (err, data): void {
  //   if (err) {
  //     console.log(err);
  //     alert(`이미지 업로드에 실패했습니다. ${err.message}`);
  //   }
  //   console.log('이미지 업로드에 성공했습니다.', data);
  //   const url = data.Location;
  //   next(url);
  // });
};

const S3 = new _S3();

export default S3;
