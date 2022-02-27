import axios, { AxiosResponse } from "axios";
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { extractUserProfileFromResponseBody } from "./models/apiResponseMapper";
import { UserProfile } from "./models/instagramProfileModels";
import { PROFILE_MOCK_DATA } from "./mocks/profileMockData";

import cors from "cors";
export const app: Application = express();
dotenv.config();

const ALLOWED_ORIGINS: string =
  (process.env.ALLOWED_ORIGINS as string) || "http://localhost:3000";

const INSTAGRAM_URL_BASEPATH = "https://www.instagram.com/";
const QUERY_PARAM = "?__a=1";
const CONTENT_TYPE_HEADER_NAME = "content-type";
const CONTENT_TYPE_TEXT_HTML = "text/html";
const CONTENT_TYPE_APPLICATION_JSON = "application/json";
const HTTP_429_TOO_MANY_REQUESTS = 429;
const USER_AGENT_MOCK_HEADER = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edg/98.0.1108.56",
};

// cors configuration
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

app.get("/ig-profile/:handle", async (req: Request, res: Response) => {
  const { handle } = req.params;
  console.log(`"handle: ${handle}"`);
  let useMock: boolean = queryStringToBoolean(req.query.useMock);
  let noCache: boolean = queryStringToBoolean(req.query.noCache);
  let cookie: string = req.query.igCookie as string;
  console.log(`Using mock: ${useMock} - using cache: ${noCache}`);
  buildInstagramUserProfile(handle, useMock, noCache, res, cookie);
});

const getInstagramUserProfile = (
  handle: string,
  cookie: string | undefined
): Promise<AxiosResponse> => {
  const url = `${INSTAGRAM_URL_BASEPATH}${handle}/${QUERY_PARAM}`;
  console.log(`Using url: ${url}`);
  if (cookie) {
    console.log("User cookie was provided");
    return axios.get(url, {
      headers: {
        ...USER_AGENT_MOCK_HEADER,
        cookie: `${cookie}`,
      },
    });
  } else {
    return axios.get(url);
  }
};

const buildInstagramUserProfile = async (
  handle: string,
  useMock: boolean,
  noCache: boolean,
  res: Response,
  cookie: string
) => {
  if (useMock) {
    const userProfile: UserProfile =
      extractUserProfileFromResponseBody(PROFILE_MOCK_DATA);
    res.status(200);
    res.send(userProfile);
    return;
  }

  // todo: handle cache logic
  getInstagramUserProfile(handle, cookie)
    .then((response: any) => {
      console.log(`Received statusCode: ${response.status}`);
      let body: any = response.data;
      console.log("Body response type:" + typeof body);

      // we are currently being rate limited
      if (isRedirectToLoginResponse(response)) {
        res.status(HTTP_429_TOO_MANY_REQUESTS);
        res.send({
          status:
            "Too many requests. You have reached the instagram public API rate limit.",
        });
        return;
      }

      if (body) {
        const userProfile: UserProfile =
          extractUserProfileFromResponseBody(body);
        if (userProfile) {
          res.status(200);
          res.send(userProfile);
        }
      }
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500);
      res.send({ status: "something went wrong" });
    });
};

/**
 * Determine wether we are being rate-limited (redirected to login page)
 *  based on the value of the response header 'content-type'
 * @param response true - if we are being redirected to login page
 *                 false - if we are receiving the expected json response
 */
const isRedirectToLoginResponse = (response): boolean => {
  let result = true;
  let contentType: string = response?.headers[CONTENT_TYPE_HEADER_NAME];
  console.log(`content-type: ${contentType}`);
  if (contentType && contentType.includes(CONTENT_TYPE_TEXT_HTML)) {
    result = true;
  } else if (
    contentType &&
    contentType.includes(CONTENT_TYPE_APPLICATION_JSON)
  ) {
    result = false;
  }
  return result;
};

const queryStringToBoolean = (inputValue): boolean => {
  return inputValue === undefined || inputValue?.toLowerCase() === "false"
    ? false
    : true;
};
