import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import { Deepgram } from "@deepgram/sdk";
import path from "path";
import { addSubtitles } from "../utils/subtitles";
dotenv.config();


export async function uploadVideo(req: Request, res: Response) {
	console.log(Object.keys(req));

	if (!req.file) {
		res.status(400).json({
			statue: false,
			message: "File not found"
		})
		return
	}

	console.log(req.file.mimetype);
	
	if (req.file?.mimetype.split("/")[0] !== "video") {
		res.status(400).json({
			statue: false,
			message: "Invalid file format"
		})
		return
	}

	// let relativeFilePath = "/uploads/" + req.file?.filename;
	// let fileMimetype = req.file.mimetype;

	// const filePath = path.join(__dirname, "..", "..", relativeFilePath)
	// let nameWithoutExt = path.parse(req.file.filename).name;

	// let deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY!);
	// const response = await deepgram.transcription.preRecorded(
	// 	{
	// 		stream: fs.createReadStream(filePath),
	// 		mimetype: fileMimetype,
	// 	},
	// 	{punctuate: true, utterances: true}
	// );

	// fs.writeFile("uploads/" + nameWithoutExt + ".srt", response.toSRT(), (err) => {
	// 	if(err) {
	// 		res.status(500).json({
	// 			statue: false,
	// 			message: "An error occured on the server",
	// 		})
	// 	}		

	// 	res.status(200).json({
	// 		statue: true,
	// 		message: "Video uploaded",
	// 		data: {
	// 			video: req.file?.filename
	// 		}
	// 	})
		
	// 	let subtitlePath = `./uploads/${nameWithoutExt}.srt`

	// 	addSubtitles(filePath, req.file!.filename, subtitlePath, (err: boolean, newPath: string) => {
	// 		console.log(err)
	// 		console.log(newPath)
	// 	});
	// })
}


export async function streamVideo(req: Request, res: Response) {
	let filename = req.params.video
	let relativeFilePath = "/subbed/" + filename;

	const filePath = path.join(__dirname, "..", "..", relativeFilePath)

	const exists = fs.existsSync(filePath);

	if (!exists) {
		res.status(400).json({
			status: false,
			message: "File not found"
		})
	}

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
	console.log(range)

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
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }

  // res.download(filePath); // Set disposition and send it.

	return	
}

export async function downloadVideo(req: Request, res: Response) {
	let video = req.params.video;
	let relativeFilePath = "/subbed/" + video;
	const filePath = path.join(__dirname, "..", "..", relativeFilePath)

	const exists = fs.existsSync(filePath);

	if (!exists) {
		res.status(400).json({
			status: false,
			message: "File not found"
		})
	}

	res.download(filePath);
	
}

export async function testBlob(req: Request, res: Response) {
	console.log(req.file?.filename);
	console.log("Endpoint reached");

	res.status(200).json({
		status: true,
		message:"Endpoint reached"
	})
	
}


