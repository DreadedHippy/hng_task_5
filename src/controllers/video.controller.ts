import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import { Deepgram } from "@deepgram/sdk";
import path from "path";
import { addSubtitles } from "../utils/subtitles";
// import transcriptQueue from "../queue";
import { addJobToQueue} from "../queue"
import mime from 'mime';
dotenv.config();


const uploadPath = process.env.UPLOAD_PATH!;
const port = process.env.PORT || 8080;

export async function uploadVideo(req: Request, res: Response) {
	let hostname = req.hostname == "localhost"? "http://localhost" + port : req.protocol + req.hostname
	console.log(hostname);
	// If no file, return error
	if (!req.file) {
		res.status(400).json({
			statue: false,
			message: "File not found"
		})
		return
	}
	
	// If file is not vide, return error
	if (req.file?.mimetype.split("/")[0] !== "video") {
		res.status(400).json({
			statue: false,
			message: "Invalid file format"
		})
		return
	}

	// Return url to file
	res.status(200).json({
		status: true,
		message: "Video uploaded successfully",
		data: {
			videoDownloadLink: `${hostname}/api/download/${req.file.filename}`,
			videoStreamLink: `${hostname}/api/${req.file.filename}`,
		}
	})

	let relativeFilePath = "/uploads/" + req.file?.filename;
	let fileMimetype = req.file.mimetype;

	const filePath = path.join(__dirname, "..", "..", relativeFilePath);
	console.log("FILEEEEE", filePath);

	await addJobToQueue(filePath, fileMimetype);
}

// Stream video handler
export async function streamVideo(req: Request, res: Response) {
	let filename = req.params.video
	let relativeFilePath = uploadPath + filename;	
	const filePath = path.join(__dirname, "..", "..", relativeFilePath)
	let mimeType = mime.getType(filePath);

	const exists = fs.existsSync(filePath);

	// If file not found
	if (!exists) {
		res.status(400).json({
			status: false,
			message: "File not found"
		})
	}

	// Get file information
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': `video/mp4`,
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = { // Set header information
      'Content-Length': fileSize,
      'Content-Type': `video/mp4`,
    };

    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res); // Stream video
  }

	return	
}


// Download video handler
export async function downloadVideo(req: Request, res: Response) {
	let video = req.params.video;
	let relativeFilePath = uploadPath + video;
	const filePath = path.join(__dirname, "..", "..", relativeFilePath)

	const exists = fs.existsSync(filePath);

	// If file does not exist, throw error

	if (!exists) {
		res.status(404).json({
			status: false,
			message: "File not found"
		})
	}

	// Else, download file
	res.download(filePath);
	
}


// Test endpoint
export async function testBlob(req: Request, res: Response) {
	console.log(req.file?.filename);
	console.log("Endpoint reached");

	res.status(200).json({
		status: true,
		message:"Endpoint reached"
	})
	
}


