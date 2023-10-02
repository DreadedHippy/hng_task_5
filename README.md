# REST API CRUD Backend Server
## HNG Task 2
This is my submission for task 2 of the HNG internship program

### Tools Used
- Node.js
- TypeScript
- express
- Postgresql

### Database Model
Person
- id
- name
- created_at

### HTTP Response Model
Response
- status: `boolean` -> always present (`false` on error, `true` on success)
- message: `string` -> not always present
- data: `object`, `array` -> not always present

### API Routes
get all persons: GET (`/api`)
get specific person: GET (`/api/{id}`)
create person: POST (`/api`)
update person: PATCH (`/api/{id}`)
delete person: DELETE (`/api/{id}`)

### How to use
To use this server, follow the instructions below:
1. Fork this repository, and create a `.env` file in the destination folder.

2. In your newly created `.env` file, fill in the necessary information.
	- POSTGRES_USER: The username of your postgres user
	- POSTGRES_PASS: The password for your postgres user
	- POSTGRES_HOST: The postgres database host
	- POSTGRES_DB: The name of your postgres database
	- POSTGRES_PORT: The port your postgres database is running on

3. With node installed, run `npm i` to install all required dependencies

4. With all dependencies installed, run `npm start` to start the server.

### UML Diagrams
- [UML Diagram as PNG](https://github.com/DreadedHippy/hng_stage_2/blob/master/UML.png)
- [UML Diagram as .dio file](https://github.com/DreadedHippy/hng_stage_2/blob/master/UML.dio)

### Sample API Request
- Use [https://aizonhngtasks.azurewebsites.net/api](https://aizonhngtasks.azurewebsites.net/api) to make a sample API request on the HNG submitted task
- Use [http://localhost:8080](http://localhost:8080) to make API requests on your locally hosted server.

### Notes
- The server runs on port 8080 by default but you can change that by adding a `PORT` field in the env file and specifying your preferred port number


