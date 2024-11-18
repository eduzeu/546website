import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {users} from "../config/mongoCollections.js"
import * as helpers from "../helpers.js";

const db = await dbConnection();
const userCollection = await users();

export const addNewUser = async (username, email, password) => {
    username = helpers.stringChecker(username);
    email = helpers.stringChecker(email);
    password = helpers.stringChecker(password);
    const user = await userCollection.findOne({email: email});
    if(user){
        return "User already added";
    }
    let userObj = {
        username: username,
        email: email,
        password: password,
        favoriteHotspots: [],
        favoriteEvents: [],
        favoriteCoffeeShops: []
    };
    const insertInfo = userCollection.insertOne(userObj);
    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Failed to insert team';
    }
    console.log("poop");
    return insertInfo;
}