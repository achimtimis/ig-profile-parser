## Build and Run

### from source
    npm install
    npm start

### via Docker

    docker build . -t instagram-parser-frontend
    docker run -p 3000:3000 -d instagram-parser-frontend
    docker ps
    docker logs id
## Running the tests
    npm test

## Accessing the UI
    Open the UI in a new browser window (default: http://localhost:3000/)
