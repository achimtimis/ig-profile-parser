## Build and Run

### from source
    npm start

### or via Docker

    docker build . -t instagram-parser-backend
    docker run -p 4000:4000 -d - instagram-parser-backend
    docker ps
    docker logs id
#
## Running the tests
    npm test

## Manual testing
    curl -i localhost:4000/ig-profile/therock

#
## Rate limiting 

After a small number of requests originating from the same ip it seems that instagram's rate-limit gets enforced and one starts receiving HTTP 200 with `content-type: text/html` which contains the redirect to the login page.

Rate limit mitigation solutions:

1. Using an `http proxies` list out of which we can randomly assign to our requests:

    Example via curl: 

    `curl -x "http://user:pwd@127.0.0.1:1234" "http://httpbin.org/ip"`
    
    or via Axios & Https-proxy-agent

    ```
    const HttpsProxyAgent = require("https-proxy-agent"),
        axios = require("axios");

    const httpsAgent = new HttpsProxyAgent({host: "proxyhost", port: "proxyport", auth: "username:password"})

    axios = axios.create({httpsAgent})
    // will use the proxy
    await axios.get('https://instagram.com/simonahalep/?__a=1'); 
    ```

2. Using an instagram developer access token

    TBA

3. Adding a server side cache layer

    TBA