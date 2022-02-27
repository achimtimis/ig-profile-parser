import React from "react";
import { UserProfile } from "../models/instagramProfileModels";

const isValidDate = (d: any) => {
  return d instanceof Date && !isNaN(d.valueOf());
};
const getDateTimeFromTimestamp = (timestamp: string | number): string => {
  let result = "<unknown>";
  const parsedDate = new Date(timestamp);
  if (isValidDate(parsedDate)) {
    result = parsedDate.toUTCString();
  }
  return result;
};

type UserProfileListProps = {
  profileList: UserProfile[];
};
export function UserProfileList({ profileList }: UserProfileListProps) {
  return (
    <>
      <hr />
      <p>
        <i>Search History</i>
      </p>
      <hr />
      <div className="profilesContent">
        {profileList && profileList.length > 0 && (
          <>
            {profileList.map((profile) => (
              <UserProfle profile={profile} />
            ))}
          </>
        )}
      </div>
    </>
  );
}

type UserProfileProps = {
  profile: UserProfile;
};
export function UserProfle({ profile }: UserProfileProps) {
  return (
    <div className="userProfile">
      <>
        {/* image needs to be downloaded by the server (due to same-origin-policy) and returned as base64 encoded */}
        <p>
          {profile.fullName} {profile.biography ? "- " + profile.biography : ""}
        </p>
        <p>Followers count: {profile.followCount}</p>
        <p>
          <i>
            Latest Post at {getDateTimeFromTimestamp(profile.latestPost.date)}:
          </i>
        </p>
        <p>
          {profile.latestPost?.caption} - {profile.latestPost?.type}.
        </p>
        <p>
          {profile.latestPost?.likeCount} likes{" & "}
          {profile.latestPost?.commentCount} comments.
        </p>
        <p>
          <i> (retrieved {getDateTimeFromTimestamp(profile.retrievalDate)})</i>
        </p>
        <hr style={{ borderTop: "1px dotted" }} />
      </>
    </div>
  );
}

export default UserProfileList;
