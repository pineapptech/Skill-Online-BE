import multer from 'multer';
import path from 'path';

class UploadMiddleWare {
    private storage = multer.diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    private fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG  are allowed'));
        }
    };

    public upload = multer({
        storage: this.storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // 24
        },
        fileFilter: this.fileFilter
    });
}

export default new UploadMiddleWare();