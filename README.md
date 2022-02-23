
## Instagram profile parser
#
## Project description
The goal of this project is to implement a full stack solution for the product requirements above using the industry-standard best practices.
#
## Tech Stack
- Frontend: Js + Typescript, React
- Backend: Nodejs, Typescript, Express
#
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

#
## Solution description