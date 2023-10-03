import cors from 'cors';
import { Router  } from "express";
import * as VideoController from "../controllers/video.controller";
import multer from "multer";
let router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.split(" ").join(""))
  }
})

const upload = multer({ storage: storage })


router.get("/:video", VideoController.streamVideo);
router.get("/download/:video", cors(), VideoController.downloadVideo);
router.post("/", cors(), upload.single('file'), VideoController.uploadVideo);

export default router;
