import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import * as helpers from "../helpers.js";

export const createReview = async (rating, text, id) => {
    rating = helpers.validateRating(rating, "Review Rating");
    text = helpers.validateString(text, "Review Text");
    id = helpers.validateNumber(id, "Location ID");

    const reviewCollection = await reviews();
    const existingReview = await reviewCollection.findOne({ id });

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
            id
        });
        return newReview;
    }
};

export const getReviews = async () => {
    try {
        const reviewCollection = await reviews();
        const reviewsList = await reviewCollection.find().toArray();
        console.log(reviewsList);
        return reviewsList;
    } catch (error) {
        throw new Error('Failed to fetch Wi-Fi reviews');
    }
};