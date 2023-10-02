import Ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
const path = ffmpegInstaller.path;

Ffmpeg.setFfmpegPath(path);
// import ffmpeg from 'fluent-ffmpeg';

export async function addSubtitles(videoPath: string, outputFileName: string, subtitlePath: string, callback: (err: boolean, newPath: string) => void) {

	console.log("inside addSubtitles");
	Ffmpeg(videoPath)
		.outputOptions(
			`-vf subtitles="${subtitlePath}"`
		)
		.on('error', (err) => {
			callback(true, err)
		})
		.save(`./subbed/${outputFileName}`)
		.on('end', () => {
			callback(false, "done");
		})
}