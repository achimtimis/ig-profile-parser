var http = require("http");
const axios = require("axios");
var lodash = require("lodash");
let { API_PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_MAPPING } = require("./mappings/apiMapping");

const INSTAGRAM_URL_BASEPATH = "https://www.instagram.com/";
const QUERY_PARAM = "?__a=1";

console.log("Server will listen at :  localhost:4000 ");

const callInstagramGetProfile = (profileHandle) => {
  const API_MAPPING = API_PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_MAPPING;
  axios
    .get(`${INSTAGRAM_URL_BASEPATH}${profileHandle}${QUERY_PARAM}`)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      let body = res.data;
      if (body) {
        Object.keys(API_MAPPING).forEach((key) => {
		console.log(typeof API_MAPPING[key]);
          if (lodash.isObject(API_MAPPING[key])) {
			console.log("isObject");
            Object.keys(API_MAPPING[key]).forEach((innerKey) => {
              console.log(API_MAPPING[key][innerKey]);
              let value = lodash.get(body, API_MAPPING[key][innerKey]);
              console.log(value);
            });
          } else if (lodash.isString(API_MAPPING[key])) {
            console.log(API_MAPPING[key]);
            let value = lodash.get(body, API_MAPPING[key]);
            console.log(value);
          }
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

http
  .createServer(function (req, res) {
    //change the MIME type to 'application/json'
    res.writeHead(200, { "Content-Type": "application/json" });

    //Create a JSON
    console.log("processing incoming request");
    callInstagramGetProfile("simonahalep");
    res.end(JSON.stringify({"done": "true"}));
  })
  .listen(4000);
