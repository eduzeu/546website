import { users } from "../config/mongoCollections.js";
import * as helpers from "../helpers.js";
import bcrypt from 'bcrypt';
const saltRounds = 16;

export const addNewUser = async (username, email, password) => {
    username = helpers.validateString(username);
    email = helpers.validateString(email);
    password = helpers.validateString(password);
    const userCollection = await users();
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
        favoriteCoffeeShops: [], 
        friends:[]
    };
    const insertInfo = await userCollection.insertOne(userObj);
    console.log(insertInfo);
    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Failed to insert user';
    }
    return insertInfo;
};
export const checkUser = async (username, password) => {
    username = helpers.validateString(username);
    password = helpers.validateString(password);
    username = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({username: username});
    if(!user){
        throw "Invalid Login";
    }
    return bcrypt.compare(password, user.password);
}

export const user = async (username, password) => {
    username = helpers.validateString(username);
    password = helpers.validateString(password);
    username = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({username: username});
    if(!user){
        throw "Invalid Login";
    }

    if(bcrypt.compare(password, user.password)){
        return user
    }else{
        return "failed log in"
    }
}

