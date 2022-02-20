import axios from "axios";
import express, { Application, Request, Response } from "express";
import lodash from "lodash";
import { PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_PATH } from "./mappings/apiMapping";
import { UserProfile } from "./mappings/UserProfile";
import { PROFILE_MOCK_DATA } from "./mocks/profileMockData";

const app: Application = express();
const port = 4000;
const INSTAGRAM_URL_BASEPATH = "https://www.instagram.com/";
const QUERY_PARAM = "?__a=1";
const API_MAPPING = PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_PATH;
const CONTENT_TYPE_HEADER_NAME = "content-type";
const CONTENT_TYPE_TEXT_HTML = "text/html";
const CONTENT_TYPE_APPLICATION_JSON = "application/json";

const handleGetUserInstagramProfile = (handle: string, res: Response) => {
  const url = `${INSTAGRAM_URL_BASEPATH}${handle}/${QUERY_PARAM}`;
  console.log(`using url: ${url}`);
  axios
    .get(url)
    .then((response: any) => {
      console.log(`Received statusCode: ${response.status}`);
      let body: any = response.data;
      console.log("Body response type:" + typeof body);

      // we are currently being rate limited
      if (isRedirectToLoginResponse(response)) {
        // always use mock for now
        body = PROFILE_MOCK_DATA;
        console.log('Rate-limit reached! Using mock data')
      }

      if (body) {
        const userProfile = extractUserProfileInfo(body);
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
}

/**
 * Determine wether we are being rate-limited (redirected to login page)
 *  based on the value of the response header 'content-type'
 * @param response true - if we are being redirected to login page
 *                 false - if we are receiving the expected json response
 */
const isRedirectToLoginResponse = (response): boolean => {
  let result = true;
  let contentType: string = response?.headers[CONTENT_TYPE_HEADER_NAME];
  console.log(`content-type: ${contentType}`)
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

const extractUserProfileInfo = (body: any): UserProfile | null => {
  let result;

  if (body) {
    result = {};
    Object.keys(API_MAPPING).forEach((key) => {
      if (lodash.isObject(API_MAPPING[key])) {
        Object.keys(API_MAPPING[key]).forEach((innerKey) => {
          console.log(key + "-" + innerKey);
          const value = lodash.get(body, API_MAPPING[key][innerKey], "");
          console.log(value);
          result[key] = result[key] || {};
          result[key][innerKey] = value;
        });
      } else if (lodash.isString(API_MAPPING[key])) {
        console.log(API_MAPPING[key]);
        const value = lodash.get(body, API_MAPPING[key], "");
        console.log(value);
        result[key] = value;
      }
    });
  }
  return result ? result : null;
};

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
  handleGetUserInstagramProfile(handle, res);
});

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
