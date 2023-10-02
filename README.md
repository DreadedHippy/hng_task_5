# REST API Video transcription Backend Server
## HNG Task 5
This is my submission for task 5 of the HNG internship program

### Tools Used
- Node.js
- TypeScript
- express
- deepgram node sdk

### HTTP Response Model
Response
- status: `boolean` -> always present (`false` on error, `true` on success)
- message: `string` -> not always present
- data: `object`, `array` -> not always present

### API Routes
- upload un-subtitled video: POST (`/api`)
- stream subtitled video: GET (`/api/name`)
- download subtitled video: GET (`/api/download/name`)

### How to use
To use this server, follow the instructions below:
1. Fork this repository, and create a `.env` file in the destination folder.

2. In your newly created `.env` file, fill in the necessary information.
- DEEPGRAM_API_KEY: The api key for the deepgram transcription service

3. With node installed, run `npm i` to install all required dependencies

4. With all dependencies installed, run `npm start` to start the server.

### Sample API Request
- Use [https://aizonhngtasks.azurewebsites.net/api](https://aizonhngtasks.azurewebsites.net/api) to make a sample API request on the HNG submitted task
- Use [http://localhost:8080](http://localhost:8080) to make API requests on your locally hosted server.

### Notes
- The server runs on port 8080 by default but you can change that by adding a `PORT` field in the env file and specifying your preferred port number


