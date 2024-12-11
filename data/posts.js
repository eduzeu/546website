
import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import { validateNumber, validateRating, validateReviewType, validateString } from "../helpers.js";
import {users } from "../config/mongoCollections.js";

const userCollection = await users(); 

// CHANGE NAMES TO POST INSTEAD OF REVIEW
export const insertUserReview = async (userId, review, place ) => {
    try{
        const newReview = {
            place: place,
            review: review,
             };

        const userReview = await userCollection.updateOne(
        { _id: new ObjectId(userId) },  // Match the user by their ID
        { $push: { reviews: newReview } },
        );

        return newReview;
    }catch (e){
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
