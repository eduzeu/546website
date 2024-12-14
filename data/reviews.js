import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import { validateNumber, validateRating, validateReviewType, validateString } from "../helpers.js";

export const createReview = async (rating, text, id, type, currUser) => {
    rating = validateRating(rating, "Rating");
    text = validateString(text, "Review Text");
    id = validateNumber(id, "Location ID");
    type = validateReviewType(type, "Review Type");
    let userReviews = currUser.reviews;
    const reviewCollection = await reviews();
    if (userReviews.id) {
        throw 'Already wrote a review';
    } else {
        const newReview = await reviewCollection.insertOne({
            rating: [rating],
            text: [text],
            id,
            type
        });
        console.log(newReview);
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