import { useState } from "react";
import "./App.css";
import UserProfileList from "./components/UserProfileList.component";
import { ApiConfigOption } from "./models/ApiConfigOptions";
import { UserProfile } from "./models/instagramProfileModels";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
const BACKEND_INSTAGRAM_PROFILE_URL = `${BACKEND_BASE_URL}/ig-profile/`;

const getBackendUrl = (
  igHandle: string,
  isDemo: boolean,
  userCookie: string | null
): string => {
  let url = `${BACKEND_INSTAGRAM_PROFILE_URL}${igHandle}`;
  if (isDemo) {
    url += "?useMock=true";
  } else if (userCookie) {
    url += `?igCookie=${userCookie}`;
  }
  return url;
};

function App() {
  let [handle, setHandle] = useState<string>("");
  let [profileList, setProfileList] = useState<UserProfile[]>([]);
  let [error, setError] = useState<string>("");
  let [isLoading, setIsloading] = useState<boolean>(false);
  let [userCookie, setUserCookie] = useState<string>("");
  let [retrievalOption, setRetrievalOption] = useState<string>(
    ApiConfigOption.USE_DEMO.toString()
  );

  const fetchInstagramUserProfile = () => {
    setError("");
    setIsloading(true);
    console.log("fetching for " + handle);
    fetch(
      getBackendUrl(
        handle,
        retrievalOption === ApiConfigOption.USE_DEMO.toString(),
        retrievalOption === ApiConfigOption.USE_USER_COOKIE.toString()
          ? userCookie
          : null
      )
    )
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`${response.status}-${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("success");
        setProfileList([data, ...profileList]);
        setIsloading(false);
      })
      .catch((error) => {
        console.log("failure");
        setError(error?.message);
        setIsloading(false);
      });
  };

  return (
    <div className="content">
      <p>
        <b>Instagram user profile details</b>
      </p>
      <div className="configurationPanel">
        <label>
          <i>API configuration</i>
          <select
            style={{ width: "30rem" }}
            value={retrievalOption}
            onChange={(e) => setRetrievalOption(e.target.value)}
          >
            <option value={ApiConfigOption.USE_DEMO}>
              Do not call Instagram but return a random user profile for demo
              purposes
            </option>
            <option value={ApiConfigOption.USE_DIRECT_CALL}>
              Call Instagram public API directly (rate limited)
            </option>
            <option value={ApiConfigOption.USE_USER_COOKIE}>
              Use the cookie of a user logged into Instagram (?)
            </option>
          </select>
        </label>
      </div>
      <div className="searchBar">
        {retrievalOption === ApiConfigOption.USE_USER_COOKIE.toString() && (
          <>
            <label>
              <p>Please provide user cookie:</p>
              <textarea
                value={userCookie}
                onChange={(e) => setUserCookie(e.target.value)}
                placeholder="user_cookie"
                className="cookieInput"
                rows={4}
              />
            </label>
          </>
        )}       
        @<input
          type="text"
          maxLength={30}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="handle"
          className="handleInput"
        />
        <button
          disabled={isLoading || !handle}
          className="searchBtn"
          title={handle ? "Search" : "Please add a valid instagram handle"}
          onClick={() => fetchInstagramUserProfile()}
        >
          Search
        </button>
      </div>

      {isLoading ? "loading..." : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}

      <UserProfileList profileList={profileList} />
    </div>
  );
}

export default App;
