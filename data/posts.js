//poster({userId, username}, body, imagelink, id of comments)
import { ObjectId } from "mongodb";
import { posts } from "../config/mongoCollections.js";
import { validateNumber, validateRating, validateReviewType, validateString, validateNumericId } from "../helpers.js";
import {users } from "../config/mongoCollections.js";
import id from "date-and-time/locale/id";

const postCollection = await posts();
export const insertUserPost = async (user, body, imageUrl, placeName) => {
    let newPost;
    try{
        if(imageUrl){
            newPost = {
                poster: {userId: user._id, username: user.username},
                placeName: placeName,
                body: body,
                image: imageUrl,
                comments: []
            };
        }
        else{
            newPost = {
                user: {userId: user._id, username: user.username},
                placeName: placeName,
                body: body,
                image: null,
                comments: []
            };
        }
        const userPost = await postCollection.insertOne(newPost);
        return userPost;
    }catch (e){
        console.error(e);
    };
};

export const findPostById = async (id) => {
    //id = validateNumericId(id, 'Post Id');
    console.log(id);
    const post = await postCollection.findOne({_id: new ObjectId(id)});
    console.log(post);
    if(!post){
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
