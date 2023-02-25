import express from 'express';
import { getUrlToUpload } from '../controllers/ImageControllers';

const router = express.Router();

router.put('/getPresignedUploadUrl', getUrlToUpload);

export default router;
