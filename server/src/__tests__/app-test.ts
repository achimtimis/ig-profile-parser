import request from "supertest";
import { app } from "../app";
import { UserProfile } from "../models/instagramProfileModels";
import axios from "axios";
import { PROFILE_MOCK_DATA } from "../mocks/profileMockData";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// const mockedAxios = axios;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Test the root path", () => {
  test("It should return HTTP 200", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Test the get instagram profile path", () => {
  test("When instagram returns valid json response it should respond with the correct subset of data", (done) => {
    const mockInstagramResponse = buildInstagramResponseObject(
      200,
      { "content-type": "application/json" },
      PROFILE_MOCK_DATA
    );
    mockedAxios.get.mockResolvedValueOnce(mockInstagramResponse);
    request(app)
      .get("/ig-profile/simonahalep")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(EXPECTED_PROFILE_RESPONSE);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          "https://www.instagram.com/simonahalep/?__a=1"
        );
        done();
      });
  });

  test("When instagram redirects to login (rate limited) it should respond with the correct mock fallback data", (done) => {
    const mockInstagramResponse = buildInstagramResponseObject(
      200,
      { "content-type": "text/html" },
      "<html><body>test</body></html>"
    );
    mockedAxios.get.mockResolvedValueOnce(mockInstagramResponse);
    request(app)
      .get("/ig-profile/therock")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(EXPECTED_PROFILE_RESPONSE);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          "https://www.instagram.com/therock/?__a=1"
        );
        done();
      });
  });

  test(
    "When calling with useMock query param, it should respond with valid mock " +
      "body and not have any outgoing http requests",
    (done) => {
      request(app)
        .get("/ig-profile/therock?useMock=true")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchObject(EXPECTED_PROFILE_RESPONSE);
          expect(mockedAxios.get).not.toHaveBeenCalled();
          done();
        });
    }
  );
});

const buildInstagramResponseObject = (
  status: number,
  headers: any,
  body: any
): any => {
  return { status, headers, data: body };
};

const EXPECTED_PROFILE_RESPONSE: UserProfile = {
  biography: "Professional tennis player 🙃",
  followCount: 1697446,
  fullName: "Simona Halep",
  latestPost: {
    caption: "Happy to be back on court ❤️ \n@nikecourt \n@wilsontennis",
    commentCount: 482,
    date: 1644858868,
    likeCount: 32570,
    type: "GraphImage",
  },
  profilePicture:
    "https://instagram.fclj2-1.fna.fbcdn.net/v/t51.2885-19/s320x320/156726735_921741491985684_5154295808143221639_n.jpg?_nc_ht=instagram.fclj2-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=GOZfkyjDWQ4AX9Ox85K&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT_SoGCxR-9yIOXEXmndBB_RlllAkhVHulP2DTGFDToEXg&oe=6217F8BC&_nc_sid=7bff83",
};
