const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
const FILE_SIZE_LIMIT = 2 * 1024 * 1024 * 1024; // 2 mb max

const busLogoUpload = multer({
    limits: FILE_SIZE_LIMIT,
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'express/assets/busImages')
        },
        filename: (req, file, callback) => {
            const extension = MIME_TYPE_MAP[file.mimetype];
            callback(null, uuid.v1() + '.' + extension);
        }
    }),
    fileFilter: (req, file, callback) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : "Invalid Mime type";
        callback(error, isValid);
    }
});

const driverImageUpload = multer({
    limits: FILE_SIZE_LIMIT,
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'express/assets/driverImages')
        },
        filename: (req, file, callback) => {
            const extension = MIME_TYPE_MAP[file.mimetype];
            callback(null, uuid.v1() + '.' + extension);
        }
    }),
    fileFilter: (req, file, callback) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : "Invalid Mime type";
        callback(error, isValid);
    }
});

module.exports = {
    busLogoUpload,
    driverImageUpload
};