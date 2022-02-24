import { useState } from "react";
import "./App.css";
import { UserProfile } from "./models/instagramProfileModels";

const BACKEND_URL = "http://localhost:4000/ig-profile/";

function App() {
  let [handle, setHandle] = useState<string>("");
  let [profileList, setProfileList] = useState<UserProfile[]>([]);
  let [error, setError] = useState<string>("");
  let [isLoading, setIsloading] = useState<boolean>(false);

  console.log(profileList);
  const fetchInstagramUserProfile = () => {
    setError("");
    setIsloading(false);
    console.log("fetching for " + handle);
    fetch(`${BACKEND_URL}${handle}?useMock=true`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProfileList([...profileList, data]);
        setIsloading(false);
        console.log("success");
      })
      .catch((error) => {
        console.log("fail");
        setError(error?.message);
        setIsloading(false);
      });
  };

  return (
    <div className="content">
      <p>
        <b>Instagram user profile details</b>
      </p>
      <div className="searchBar">
        <label>
          <input
            type="text"
            maxLength={30}
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@handle"
            className="searchInput"
          />
        </label>
        <button
          disabled={isLoading || !handle}
          className="searchBtn"
          title={handle ? "Search" : "Please add a valid instagram handle"}
          onClick={() => fetchInstagramUserProfile()}
        >
          Search
        </button>
      </div>
      {error ?? null}
      <div className="profilesContent">
        <hr />
        {profileList && profileList.length > 0 && (
          <>
            <p>
              <i>History</i>
            </p>
            {profileList.map((profile) => (
              <>
                <p>{profile.fullName}</p>
                <hr style={{ borderTop: "1px dotted" }} />
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
