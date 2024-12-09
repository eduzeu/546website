import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import { validateNumber, validateRating, validateReviewType, validateString } from "../helpers.js";
import {users } from "../config/mongoCollections.js";

const userCollection = await users(); 

export const createReview = async (rating, text, id, type) => {
    rating = validateRating(rating, "Rating");
    text = validateString(text, "Review Text");
    id = validateNumber(id, "Location ID");
    type = validateReviewType(type, "Review Type");

    const reviewCollection = await reviews();
    const existingReview = await reviewCollection.findOne({ id, type });

    if (existingReview) {
        const updatedResult = await reviewCollection.updateOne(
            { id },
            {
                $push: {
                    rating: rating,
                    text: text
                }
            }
        );
        return updatedResult;
    } else {
        const newReview = await reviewCollection.insertOne({
            _id: new ObjectId(),
            rating: [rating],
            text: [text],
            id,
            type
        });
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