export interface LatestPostInfo {
  date?: string;
  likeCount: string;
  commentCount: string;
  caption: string;
  type: string;
}

export interface UserProfile {
  retrievalDate?: string;
  profilePicture: string;
  biography: string;
  fullName: string;
  followCount: string;
  latestPost?: LatestPostInfo;
}
