export interface LatestPostInfo {
  date: number | string;
  likeCount: number | string;
  commentCount: number | string;
  caption: string;
  type: string;
}

export interface UserProfile {
  retrievalDate: string;
  profilePicture: string;
  biography: string;
  fullName: string;
  followCount: number | string;
  latestPost: LatestPostInfo;
}
