import bcrypt from 'bcrypt';
import { users } from "../config/mongoCollections.js";
import { validateEmailAddress, validatePassword, validateString } from "../helpers.js";
const saltRounds = 16;

export const addNewUser = async (username, email, password) => {
    username = validateString(username, "Username")
    email = validateEmailAddress(email, "Email");
    password = validatePassword(password, "Password");
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
        reviews: [],
        friends: []
    };
    const insertInfo = await userCollection.insertOne(userObj);
    //console.log(insertInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Failed to insert user';
    }
    return insertInfo;
};

// console.log(await addNewUser("user123", "ed@gmail.com", "545454"));

export const checkUser = async (username, password) => {
    username = validateString(username);
    password = validateString(password);
    //console.log(password);
    username = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) {
        throw "Invalid Login";
    }
    let isValid = await bcrypt.compare(password, user.password);
    //console.log(isValid);
    if (isValid) {
        return user._id;
    }
    else {
        throw 'Invalid Login';
    }
}