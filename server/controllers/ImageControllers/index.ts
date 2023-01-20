import S3 from '../../s3';
import { Request, Response } from 'express';

export const getUrlToUpload = async (req: Request, res: Response) => {
  try {
    const { photoKey } = req.body;
    const url = await S3.getPresignedUploadUrl(photoKey);
    if (!url) {
      res.header('Access-Control-Allow-Origin', '*');
      return res.status(404).json({
        status: 404,
        message: '이미지 저장소를 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      status: 200,
      payload: {
        url: url,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: '서버 오류',
    });
  }
};
