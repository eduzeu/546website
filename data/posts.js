//poster({userId, username}, body, imagelink, id of comments)
import { posts } from "../config/mongoCollections.js";
import { validateCloudinaryUrl, validateString, validateUserCookie } from "../helpers.js";

const postCollection = await posts();
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
        const userPost = await postCollection.insertOne(newPost);
        return userPost;

    } catch (e) {
        console.error(e);
    };
};

// console.log(await insertUserReview("67571a0a7efa087d3782482b", "Central Park", "This is a good place", "4.0"));

export const getUserFeedReviews = async () => {
    try {
        const displayReviews = await userCollection.find(
            {
                reviews: { $exists: true, $not: { $size: 0 } } // Ensures reviews exist and are not empty
            },
            {
                projection: { username: 1, reviews: 1 } // Only include the reviews field in the result
            }
        ).toArray();
        console.log(displayReviews);
        return displayReviews;
    } catch (e) {
        console.error(e);
    }
};
