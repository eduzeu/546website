import { ObjectId } from "mongodb";
import { reviews, users } from "../config/mongoCollections.js";
import { validateNumber, validateRating, validateReviewType, validateString } from "../helpers.js";

export const createReview = async (rating, text, id, type, currUser) => {
    rating = validateRating(rating, "Rating");
    text = validateString(text, "Review Text");
    id = validateNumber(id, "Location ID");
    type = validateReviewType(type, "Review Type");
    let userReviews = currUser.reviews;
    let newReview;
    const reviewCollection = await reviews();
    const userCollection = await users();
    if (userReviews.includes(id)) {
        throw 'Already wrote a review';
    } else {
        let hasReviews = await reviewCollection.findOne({id, type});
        if(hasReviews){
            newReview = await reviewCollection.updateOne(
                { id },
                {
                    $push: {
                        rating: rating,
                        text: text
                    }
                }
            );
        }
        else{
            newReview = await reviewCollection.insertOne({
                rating: [rating],
                text: [text],
                id,
                type
            });
        }
        userReviews.push(id);
        const updateResult = await userCollection.findOneAndUpdate({_id: currUser._id}, {$set: {reviews: userReviews}});
        return newReview;
    }
};

export const getReviews = async (type) => {
    let findParams = {};
    if (type !== undefined) {
        type = validateReviewType(type, "Review Type");
        findParams = { type: type }
    }

    try {
        const reviewCollection = await reviews();
        let reviewsList = await reviewCollection.find(findParams).toArray();
        return reviewsList;

    } catch (error) {
        throw new Error('Failed to fetch reviews');
    }
};

export const getReviewById = async (id, type) => {
    id = validateNumber(id, "Location ID");
    type = validateReviewType(type, "Review Type");

    try {
        const reviewCollection = await reviews();
        let review = await reviewCollection.findOne({ id, type });
        return review;

    } catch (error) {
        return {};
    }
};