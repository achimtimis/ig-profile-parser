import http from "http";
import axios from "axios";
import lodash from "lodash";
import { PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_PATH } from "./mappings/apiMapping";

const INSTAGRAM_URL_BASEPATH = "https://www.instagram.com/";
const QUERY_PARAM = "?__a=1";

console.log("Server will listen at :  localhost:4000 ");

const callInstagramGetProfile = (profileHandle: any) => {
  const API_MAPPING = PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_PATH;
  axios
    .get(`${INSTAGRAM_URL_BASEPATH}${profileHandle}${QUERY_PARAM}`)
    .then((res: any) => {
      console.log(`statusCode: ${res.status}`);
      const body = res.data;
      if (body) {
        Object.keys(API_MAPPING).forEach((key) => {
          console.log(typeof API_MAPPING[key]);
          if (lodash.isObject(API_MAPPING[key])) {
            console.log("isObject");
            Object.keys(API_MAPPING[key]).forEach((innerKey) => {
              console.log(API_MAPPING[key][innerKey]);
              const value = lodash.get(body, API_MAPPING[key][innerKey]);
              console.log(value);
            });
          } else if (lodash.isString(API_MAPPING[key])) {
            console.log(API_MAPPING[key]);
            const value = lodash.get(body, API_MAPPING[key]);
            console.log(value);
          }
        });
      }
    })
    .catch((error: any) => {
      console.error(error);
    });
};

http
  .createServer(function (req: any, res: any) {
    //change the MIME type to 'application/json'
    res.writeHead(200, { "Content-Type": "application/json" });

    //Create a JSON
    console.log("processing incoming request");
    callInstagramGetProfile("simonahalep");
    res.end(JSON.stringify({ done: "true" }));
  })
  .listen(4000);
