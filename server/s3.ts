import AWS from 'aws-sdk';
import { config } from './envconfig';
const { bucketName, bucketRegion, identityPoolId, accessKeyId, secretAccessKey } = config.aws;

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
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
        region: this.bucketRegion,
      });

      this.s3 = new AWS.S3();
    } catch (error) {
      console.log(error);
    }
  }

  async getPresignedUploadUrl(photoKey: string) {
    const url = await this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: `${photoKey}`,
      ContentType: 'image/*',
      Expires: 300,
    });

    return url;
  }
}

const S3 = new _S3();

export default S3;
