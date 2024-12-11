import * as userData from "../config/mongoCollections.js";

export const getAllFriends = async (name) => {
    if (!name) throw 'Name is required';
    if (typeof name !== 'string') throw 'User Id must be a string';
    if (name.trim().length === 0) throw 'User Id cannot be empty or just spaces';

    name = name.trim().toLowerCase();

    const data = await userData.users();
    const user = await data.findOne({username: name});

    if (!user) throw "User not found";
    
    // Assuming friends is an array in your user document
    return user.friends || [];
}