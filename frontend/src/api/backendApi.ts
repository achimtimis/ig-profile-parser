import { ApiConfigOption } from "../models/ApiConfigOptions";
import { UserProfile } from "../models/instagramProfileModels";

const BACKEND_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
const BACKEND_INSTAGRAM_PROFILE_URL = `${BACKEND_BASE_URL}/ig-profile/`;

type UserProfileApiResponse = {
    error: string | null,
    data: UserProfile | null
  };

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

export const getInstagramUserProfile = async (
  handle: string,
  retrievalOption: string,
  userCookie: string
) : Promise<UserProfileApiResponse> => {
  console.log("fetching for " + handle);
  try {
    let response = await fetch(
      getBackendUrl(
        handle,
        retrievalOption === ApiConfigOption.USE_DEMO.toString(),
        retrievalOption === ApiConfigOption.USE_USER_COOKIE.toString()
          ? userCookie
          : null
      )
    );
    if (response.ok) {
        let userProfile = await response.json() as UserProfile;
        return {error: null, data: userProfile};
    } else {
        return {error:`${response.status}-${response.statusText}`, data: null }
    }
  } catch (err) {
     console.log(err);
     return {error: 'Could not fetch user profile', data: null}
  }
};
