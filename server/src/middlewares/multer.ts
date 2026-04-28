import multer from "multer";
import fs from 'fs/promises'
import { RequestHandler } from "express";
import { fileTypeFromFile } from "file-type";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp')
    },
    filename: (req, file, cb) => {
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1e6) + '-' + file.originalname
        cb(null, uniqueFilename)
    },
})

export const multerUploadImage = multer({
    storage,
    limits: {
        fileSize: 8 * 1024 * 1024 //In Bytes : 8mb
    },
    fileFilter: (req, file, cb) => {
        // Currently designed for images only and upto 8mb
        if (file.mimetype.startsWith('image/')) return cb(null, true)
        cb(new Error('Invalid File type'))
    },
})


export const checkMulterUploadPath: RequestHandler = async (req, res, next) => {
    await fs.mkdir('tmp', { recursive: true })
    next()
}


export const checkMagicBytes: RequestHandler = async (req, res, next) => {
    const file = req.file
    if (!file) return res.fail(400, "BAD_REQUEST", "File is invalid/empty")
    const response = await fileTypeFromFile(file.path)
    if (!response?.mime.startsWith('image/')) {
        await fs.unlink(file.path)
        return res.fail(400, "BAD_REQUEST", "Invalid File type")
    }
    next()
}