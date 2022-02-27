
## Instagram profile parser
![App screnshot](ss1.png)
## Project description
The goal of this project is to implement a full stack solution for parsing an instagram user profile data using the available public API. 
## Tech Stack
- Frontend: Typescript, React
- Backend: Typescript, Nodejs, Express
## Build and run
  #### Prerequisites: `docker`
  ### Run backend & frontend apps:
  ```
  docker-componse up -d
  ```
  Access the ui at http://localhost:3000/. Default configurations like ports may be changed in the root `.env` file.

  #### Clean up:
  ```
  docker-compose down --rmi all
  ```

  (For more indepth info, consult the README of both services).


## Product requirements

1. A team of software engineers can productively collaborate on this codebase.
2. A client application can input an Instagram handle and receive a JSON response that contains:
  1. Datetime data was last retrieved from Instagram.
  2. Instagram account's biography
  3. Instagram account's full name
  4. Instagram account's followers count
  5. Instagram account's most recent post, including its:
    1. Media URL
    2. Number of likes
    3. Number of comments
    4. Post type, e.g. carousel, image, or video

Note: Data may be cached for up to 1 hour, but clients must be provided with a method to request the latest data.

#### Hint

Instagram has a public, rate-limited API that returns a JSON response. To retrieve an account, for instance, append ?__a=1 to the URL.
- Account: https://www.instagram.com/simonahalep/?__a=1
- Post: https://www.instagram.com/p/CZ9zjX3jI_l/?__a=1

## Further improvements
- return the profile image as base64 encoded from the server to workaround the same-origin-policy
- introduce caching for the instagram profile call
- find a solution to better scale the rate limiting mitigations