import { users } from "../config/mongoCollections.js";
import { dbConnection } from "../config/mongoConnection.js";
import * as helpers from "../helpers.js";

const db = await dbConnection();
const userCollection = await users();

export const addNewUser = async (username, email, password) => {
    username = helpers.validateString(username);
    email = helpers.validateString(email);
    password = helpers.validateString(password);
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