import { Router } from "express";
import multer from "multer";
import { uploadToIpfs } from "../controllers/ipfsController";

const upload = multer();
const router = Router();

router.post("/upload", upload.single("file"), uploadToIpfs);

export default router;
