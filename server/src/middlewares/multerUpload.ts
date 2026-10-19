import fs from 'fs'
import multer from "multer"



export const checkMulterUploadPath = async () => {
  await fs.promises.mkdir('uploads', { recursive: true })
}


const storage = multer.diskStorage(
  {
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    },
  }
)

export default multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024 //In Bytes : 8mb
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true)
    cb(new Error('Invalid File type'))
  },
})
