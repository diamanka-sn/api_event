import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_images',
    allowedFormats: ['jpg', 'png', 'jpeg', 'HEIC'],
    public_id: (req: Request, file: { originalname: any; }) => `${Date.now()}`,
  },
} as any);

const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event_images',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    public_id: (req: Request, file: { originalname: any; }) => `${Date.now()}`,
  },
} as any);

const eventVideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event_videos',
    resource_type: 'video',
    allowedFormats: ['mp4', 'mov', 'avi'],
    public_id: (req: Request, file: { originalname: any; }) => `${Date.now()}`,
  },
} as any);


const upload = multer({ storage });
const uploadEventImages = multer({ storage: eventStorage });
const uploadEventVideos = multer({ storage: eventVideoStorage });
export { upload, uploadEventImages, uploadEventVideos };