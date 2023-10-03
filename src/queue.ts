import dotenv from 'dotenv';
import fs from 'fs';
import { Deepgram } from "@deepgram/sdk";
import Queue from "bull";
import path from 'path';

dotenv.config();

const transcriptQueue = new Queue("transcript-queue", process.env.REDIS_URL!);
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY!);

export default transcriptQueue;

export async function addJobToQueue(filePath: string, fileMimetype: string) {
	// console.log("QUEEEEEEEUE", filePath);
	const job = await transcriptQueue.add({filePath, fileMimetype})
	console.log(`Job ${job.id} added to the queue.`);

}

const uploadPath = process.env.UPLOAD_PATH!;

// The process for the transcript queue
transcriptQueue.process( async (job, done) => {	
	try {
		console.log(`Transcribing  ${JSON.stringify(job.data)} -- Job ${job.id}`);

		const filePath = job.data.filePath,
			fileMimetype = job.data.fileMimetype,
			nameWithoutExt = path.parse(filePath).name;

		// Transcribe with deepgram
		const response = await deepgram.transcription.preRecorded(
			{
				stream: fs.createReadStream(filePath),
				mimetype: fileMimetype,
			},
			{punctuate: true, utterances: true}
		);

		
		job.progress(42);

		console.log("Video transcribed successfully")

		fs.writeFile(uploadPath + nameWithoutExt + ".srt", response.toSRT(), (err) => {
			if(err) {
				console.log ("Failed to transcribe file")

				done(new Error('Error saving transcript'));
			}
			let subtitlePath = `${uploadPath}${nameWithoutExt}.srt`

			console.log("Transcript saved successfully. Transcript location: ", subtitlePath);

			done();
		})
	} catch (e) {
		console.log("Something went wrong")
	}
	
})