import { useState } from "react";
import { getInstagramUserProfile } from "./api/backendApi";
import "./App.css";
import UserProfileList from "./components/UserProfileList.component";
import { ApiConfigOption } from "./models/ApiConfigOptions";
import { UserProfile } from "./models/instagramProfileModels";

function App() {
  let [handle, setHandle] = useState<string>("");
  let [profileList, setProfileList] = useState<UserProfile[]>([]);
  let [error, setError] = useState<string>("");
  let [isLoading, setIsloading] = useState<boolean>(false);
  let [userCookie, setUserCookie] = useState<string>("");
  let [retrievalOption, setRetrievalOption] = useState<string>(
    ApiConfigOption.USE_DEMO.toString()
  );

  const fetchInstagramUserProfile = async () => {
    setError("");
    setIsloading(true);
    let { error, data } = await getInstagramUserProfile(
      handle,
      retrievalOption,
      userCookie
    );
    if (error) {
      setError(error);
    } else if (data) {
      setProfileList([data, ...profileList]);
    }
    setIsloading(false);
  };

  return (
    <div className="content" data-testid="content">
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
        @
        <input
          type="text"
          data-testid="handle-input"
          maxLength={30}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="handle"
          className="handleInput"
        />
        <button
          data-testid="search-btn"
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
