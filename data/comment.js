import { ObjectId } from "mongodb";
import { comment } from "../config/mongoCollections.js";
import { reviews } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";

const userCollection = await users(); 
const reviewsCollection = await reviews(); 

export const createComment = async (commenter, parent, body,comments) =>
{
    // todo:validate stuff
    
    const commentCollection = await comment(); 
}

