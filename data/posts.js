//poster({userId, username}, body, imagelink, id of comments)
import { ObjectId } from "mongodb";
import { posts } from "../config/mongoCollections.js";
import { validateCloudinaryUrl, validateNumericId, validateObjectIdString, validateString, validateUserCookie } from "../helpers.js";

export const insertUserPost = async (user, body, imageUrl, imageAltText, placeName) => {
    user = validateUserCookie(user, 'User');
    body = validateString(body, 'Body');
    placeName = validateString(placeName, 'Place Name');

    if (imageUrl && imageAltText) {
        imageUrl = validateCloudinaryUrl(imageUrl, 'Image URL');
        imageAltText = validateString(imageAltText, 'Image Alt Text');

    // If imageUrl exists and imageAltText doesn't (or vise versa)
    // throw an error
    } else if ((imageUrl && !imageAltText) || (!imageUrl && imageAltText)) {
        throw 'Both Image URL and Image Alt Text must be provided';
    }

    let newPost;
    try {
        if (imageUrl) {
            newPost = {
                poster: { userId: user._id, username: user.username },
                placeName: placeName,
                body: body,
                image: {
                    url: imageUrl,
                    altText: imageAltText
                },
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
    const locationImages = await postCollection.find({ 'location.id': locId, 'location.type': 'coffee' }).toArray();
    return locationImages;
}