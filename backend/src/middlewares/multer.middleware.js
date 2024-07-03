import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, "./public/profilePicture");
    },
    filename: function(req, file, cb) {
        cb(null, `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } 
    else {
        cb(new ApiError(500, 'Invalid file type. Please upload an image file (jpg, jpeg, png).'), false);
    }
}

// export { storage };
export const upload = multer({ 
    storage,
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});