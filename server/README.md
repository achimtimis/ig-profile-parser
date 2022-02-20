# Running via docker:

- docker build . -t instagram-parser-backend
- docker run -p 4000:4000 -d - instagram-parser-backend
- docker ps
- docker logs id

## Manual testing
curl -i localhost:4000

# Notes

- it seems that when you hit the rate-limit of requests you start receiving HTTP 200 or HTTP 302 moved, with a location header which points to the login page