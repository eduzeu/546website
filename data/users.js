import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {users} from "../config/mongoCollections.js"
import * as helpers from "../helpers.js";
import bcrypt from 'bcrypt';
const saltRounds = 16;

const db = await dbConnection();
const userCollection = await users();
export const addNewUser = async (username, email, password) => {
    username = helpers.stringChecker(username);
    email = helpers.stringChecker(email);
    password = helpers.stringChecker(password);
    const eUser = await userCollection.findOne({email: email});
    const uUser = await userCollection.findOne({username: username});
    if(eUser || uUser){
        throw "Account exists!";
    }
    const hashedPass = await bcrypt.hash(password, saltRounds);
    let userObj = {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPass,
        favoriteHotspots: [],
        favoriteEvents: [],
        favoriteCoffeeShops: []
    };
    const insertInfo = await userCollection.insertOne(userObj);
    console.log(insertInfo);
    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Failed to insert user';
    }
    return insertInfo;
};
export const checkUser = async (username, password) => {
    username = helpers.stringChecker(username);
    password = helpers.stringChecker(password);
    username = username.toLowerCase();
    const user = await userCollection.findOne({username: username});
    if(!user){
        throw "Invalid Login";
    }
    return bcrypt.compare(password, user.password);
}