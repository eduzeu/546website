import { sessionTokens, users } from "../config/mongoCollections.js";
import { validateDate, validateObjectId, validateUUID } from "../helpers.js";

export const addSessionToken = async (sessionId, userId, expiresAt) => {
    sessionId = validateUUID(sessionId, 'Session Id')
    validateObjectId(userId, 'User Id')
    validateDate(expiresAt, 'Expires At Date');

    let tokenObj = {
        sessionId: sessionId,
        userId: userId,
        expiresAt: expiresAt
    };
    const sessionTokensCollection = await sessionTokens();
    let inserted = await sessionTokensCollection.insertOne(tokenObj);
    if (!inserted) {
        throw 'Error inserting token';
    }
    return inserted;
}
export const findUserFromSessionToken = async (sessionToken) => {
    sessionToken = validateUUID(sessionToken, 'Session Token');

    const sessionTokensCollection = await sessionTokens();
    const session = await sessionTokensCollection.findOne({ sessionId: sessionToken });

    if (!session) {
        throw 'Invalid sessionId';
    }

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: session.userId });

    if (!user) {
        throw 'No matching user for session';
    }
    return user;
}
export const sessionChecker = async (sessionToken) => {
    if (sessionToken == null) {
        throw 'You need to be logged in to access this page! null token';
    }

    sessionToken = validateUUID(sessionToken, 'Session Token');

    const sessionTokensCollection = await sessionTokens();
    let validToken = await sessionTokensCollection.findOne({ sessionId: sessionToken });

    if (!validToken) {
        throw 'You need to be logged in to access this page! token not in database';
    }

    const userCollection = await users();
    let user = await userCollection.findOne({ _id: validToken.userId });

    if (!user) {
        throw 'You need to be logged in to access this page! not matching userId';
    }

    let currDate = new Date();
    if (currDate > validToken.expiresAt) {
        throw 'Login has expired, please log in again! expired';
    }

    return sessionToken;
}
export const deleteSessionToken = async (sessionToken) => {
    if (sessionToken == null) {
        throw 'You need to be logged in to log out';
    }

    sessionToken = validateUUID(sessionToken, 'Session Token');

    const sessionTokensCollection = await sessionTokens();
    const result = await sessionTokensCollection.deleteOne({ sessionId: sessionToken });

    if (result.deletedCount == 0) {
        throw 'Token not found';
    }
    return true;
}
export const updateExpiration = async (sessionToken) => {
    if (sessionToken == null) {
        throw 'Not logged in';
    }

    sessionToken = validateUUID(sessionToken, 'Session Token');

    const sessionTokensCollection = await sessionTokens();
    const result = await sessionTokensCollection.findOne({ sessionId: sessionToken });

    if (!result) {
        throw 'Invalid no matching object with given sessionId';
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    let newObj = { sessionId: sessionToken, userId: result.userId, expiresAt };

    const insertResult = await sessionTokensCollection.findOneAndReplace({ sessionId: sessionToken }, newObj);
    if (!insertResult) {
        throw 'Error inserting new object';
    }
    
    return true;
}