//poster({userId, username}, body, imagelink, id of comments)
import { ObjectId } from "mongodb";
import { posts } from "../config/mongoCollections.js";
import { validateCloudinaryUrl, validateObjectIdString, validateString, validateUserCookie } from "../helpers.js";
import {users } from "../config/mongoCollections.js";

const postCollection = await posts();
export const insertUserPost = async (user, body, imageUrl, placeName) => {
    user = validateUserCookie(user, 'User');
    body = validateString(body, 'Body');
    placeName = validateString(placeName, 'Place Name');
    if (imageUrl) { imageUrl = validateCloudinaryUrl(imageUrl, 'Image URL') }

    let newPost;
    try {
        if (imageUrl) {
            newPost = {
                poster: { userId: user._id, username: user.username },
                placeName: placeName,
                body: body,
                image: imageUrl,
                comments: []
            };
        }
        else {
            newPost = {
                poster: { userId: user._id, username: user.username },
                placeName: placeName,
                body: body,
                image: null,
                comments: []
            };
        }
        const userPost = await postCollection.insertOne(newPost);
        return userPost;

    } catch (e) {
        console.error(e);
    };
};

export const findPostById = async (id) => {
    id = validateObjectIdString(id, 'Post Id')
    console.log(id);
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
        const displayReviews = await postCollection.find().toArray();
        return displayReviews;
    } catch (e) {
        console.error(e);
    }
};
