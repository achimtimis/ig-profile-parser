const API_PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_MAPPING = {
    profilePicture: "graphql.user.profile_pic_url_hd",
    biography: "graphql.user.biography", 
    fullName: "graphql.user.full_name", 
    followCount: "graphql.user.edge_followed_by.count",
    latestPost: {
        date: "graphql.user.edge_owner_to_timeline_media.edges[0].node.taken_at_timestamp",
        likeCount: "graphql.user.edge_owner_to_timeline_media.edges[0].node.edge_liked_by.count",
        commentCount: "graphql.user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_comment.count",
        caption: "graphql.user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_caption.edges[0].node.text",
        type: "graphql.user.edge_owner_to_timeline_media.edges[0].node.__typename"
    }
}

module.exports.API_PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_MAPPING = API_PROFILE_RESPONSE_TO_OBJECT_ATTRIBUTE_MAPPING;