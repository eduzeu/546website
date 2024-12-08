import bcrypt from 'bcrypt';
import { users } from "../config/mongoCollections.js";
import { validateEmailAddress, validateString } from "../helpers.js";
const saltRounds = 16;

export const addNewUser = async (username, email, password) => {
    username = validateString(username, "Username")
    email = validateEmailAddress(email, "Email");
    password = validateString(password, "Password");
    const userCollection = await users();
    const eUser = await userCollection.findOne({ email: email });
    const uUser = await userCollection.findOne({ username: username });
    if (eUser || uUser) {
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
        reviews: []
    };
    const insertInfo = await userCollection.insertOne(userObj);
    console.log(insertInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Failed to insert user';
    }
    return insertInfo;
};
export const checkUser = async (username, password) => {
    username = validateString(username);
    password = validateString(password);
    username = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) {
        throw "Invalid Login";
    }
    return bcrypt.compare(password, user.password);
}