import axios, { AxiosResponse } from "axios";
import express, { Application, Request, Response } from "express";
import { extractUserProfileFromResponseBody } from "./models/apiResponseMapper";
import { UserProfile } from "./models/instagramProfileModels";
import { PROFILE_MOCK_DATA } from "./mocks/profileMockData";

export const app: Application = express();
const INSTAGRAM_URL_BASEPATH = "https://www.instagram.com/";
const QUERY_PARAM = "?__a=1";
const CONTENT_TYPE_HEADER_NAME = "content-type";
const CONTENT_TYPE_TEXT_HTML = "text/html";
const CONTENT_TYPE_APPLICATION_JSON = "application/json";
const HTTP_429_TOO_MANY_REQUESTS = 429;

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
  console.log(`Using mock: ${useMock} - using cache: ${noCache}`);
  buildInstagramUserProfile(handle, useMock, noCache, res);
});

const getInstagramUserProfile = (handle: string): Promise<AxiosResponse> => {
  const url = `${INSTAGRAM_URL_BASEPATH}${handle}/${QUERY_PARAM}`;
  console.log(`Using url: ${url}`);
  return axios.get(url);
};

const buildInstagramUserProfile = async (
  handle: string,
  useMock: boolean,
  noCache: boolean,
  res: Response
) => {
  
  if (useMock) {
    const userProfile: UserProfile =
      extractUserProfileFromResponseBody(PROFILE_MOCK_DATA);
    res.status(200);
    res.send(userProfile);
    return;
  }

  // todo: handle cache logic
  getInstagramUserProfile(handle)
    .then((response: any) => {
      console.log(`Received statusCode: ${response.status}`);
      let body: any = response.data;
      console.log("Body response type:" + typeof body);

      // we are currently being rate limited
      if (isRedirectToLoginResponse(response)) {
        res.status(HTTP_429_TOO_MANY_REQUESTS);
        res.send({"status": "Too many requests. You have reached the instagram public API rate limit."});
        return
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
