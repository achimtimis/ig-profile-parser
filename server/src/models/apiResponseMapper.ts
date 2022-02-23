import lodash from "lodash";
import { UserProfile } from "./instagramProfileModels";

/**
 * Object paths for the attributes necessary for a user profile relative to the reponse body json.
 */
export const PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_PATH: UserProfile = {
  profilePicture: "graphql.user.profile_pic_url_hd",
  biography: "graphql.user.biography",
  fullName: "graphql.user.full_name",
  followCount: "graphql.user.edge_followed_by.count",
  latestPost: {
    date: "graphql.user.edge_owner_to_timeline_media.edges[0].node.taken_at_timestamp",
    likeCount:
      "graphql.user.edge_owner_to_timeline_media.edges[0].node.edge_liked_by.count",
    commentCount:
      "graphql.user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_comment.count",
    caption:
      "graphql.user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0].node.text",
    type: "graphql.user.edge_owner_to_timeline_media.edges[0].node.__typename",
  },
};

/**
 * Generically build the user profile based on the current object attribute mapping above. For new attributes,
 * populating them in the PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_PATH should be enough for a correct deserialization.
 * @param body the json body of the instagram GET /profile response
 *
 * @returns the extracted user profile.
 */
export const extractUserProfileFromResponseBody = (body: any): UserProfile => {
  let result;
  const API_MAPPING = PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_PATH;
  if (body) {
    result = {};
    result.retrievalDate = Date.now();
    Object.keys(API_MAPPING).forEach((key) => {
      if (lodash.isObject(API_MAPPING[key])) {
        Object.keys(API_MAPPING[key]).forEach((innerKey) => {
          const value = lodash.get(body, API_MAPPING[key][innerKey], "");
          console.log(`${key}${innerKey}: ${value}`);
          result[key] = result[key] || {};
          result[key][innerKey] = value;
        });
      } else if (lodash.isString(API_MAPPING[key])) {
        const value = lodash.get(body, API_MAPPING[key], "");
        console.log(`${key}: ${value}`);
        result[key] = value;
      }
    });
  }
  return result ? result : null;
};
