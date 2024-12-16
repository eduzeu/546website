//poster({userId, username}, body, imagelink, id of comments)
import { ObjectId } from "mongodb";
import { posts } from "../config/mongoCollections.js";
import { validateImageDetails, validateLocationPostDetails, validateNumericId, validateObjectIdString, validateString, validateUserCookie } from "../helpers.js";

export const insertUserPost = async (user, body, title, image, location) => {
    user = validateUserCookie(user, 'User');
    body = validateString(body, 'Body');
    title = validateString(title, 'Title');
    image = validateImageDetails(image, 'Image Details');
    location = validateLocationPostDetails(location, 'Location Details');

    let newPost;
    try {
        newPost = {
            poster: { userId: user._id, username: user.username },
            title: title,
            body: body,
            image: !image ? null : image,
            location: !location ? null: location,
            comments: []
        };

        const postCollection = await posts();
        const userPost = await postCollection.insertOne(newPost);
        return userPost;

    } catch (e) {
        console.error(e);
    };
};

// console.log(await insertUserPost("675b72b6f057d21224af3924", "this is a good place", null, null, "manhattan"));

export const findPostById = async (id) => {
    id = validateObjectIdString(id, 'Post Id')
    console.log(id);
    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    console.log(post);
    if (!post) {
        throw 'Unable to find post with matching id';
    }
    return post;
}

// console.log(await insertUserReview("67571a0a7efa087d3782482b", "Central Park", "This is a good place", "4.0"));

export const getUserFeedPost = async () => {
    try {
        const postCollection = await posts();
        const displayReviews = await postCollection.find().toArray();
        return displayReviews;
    } catch (e) {
        console.error(e);
    }
};

export const getLocationImages = async (locId) => {
    locId = validateNumericId(locId, 'Location Id');
    const postCollection = await posts();
    const locationImages = await postCollection.find(
        { 'location.id': locId, 'location.type': 'coffee' },
        { projection: { image: 1, _id: 0 }}
    ).toArray();
    return locationImages.map(item => item.image);
}