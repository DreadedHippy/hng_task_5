import fs from 'fs';
import { Deepgram } from "@deepgram/sdk";
import Queue from "bull";
import path from 'path';

const transcriptQueue = new Queue("transcript-queue", 'redis://127.0.0.1:6379');

export default transcriptQueue;

export async function addJobToQueue(filePath: string, fileMimetype: string) {
	const job = await transcriptQueue.add({filePath, fileMimetype})
	console.log(`Job ${job.id} added to the queue.`);

}

transcriptQueue.process( async (job, done) => {	
	const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY!);
	console.log(`Transcribing  ${JSON.stringify(job.data)} -- Job ${job.id}`);

	const filePath = job.data.filePath,
		fileMimetype = job.data.fileMimetype,
		nameWithoutExt = path.parse(filePath).name;

	const response = await deepgram.transcription.preRecorded(
		{
			stream: fs.createReadStream(filePath),
			mimetype: fileMimetype,
		},
		{punctuate: true, utterances: true}
	);

	
	job.progress(42);

	console.log("Video transcribed successfully")

	fs.writeFile("uploads/" + nameWithoutExt + ".srt", response.toSRT(), (err) => {
		if(err) {
			console.log ("Failed to transcribe file")

			done(new Error('Error saving transcript'));
		}
		let subtitlePath = `./uploads/${nameWithoutExt}.srt`


		// // call done when finished
		console.log("Transcript daved successfully. Transcript location: ", subtitlePath);

		done();
	})
		
	// console.log ("Video transcribed sucessfully: ");

  // // or pass it a result
  // done(null, { framerate: 29.5 /* etc... */ });

	// })
	
})