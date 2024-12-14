import * as userData from "../config/mongoCollections.js";
import { validateString } from "../helpers.js";

export const getAllFriends = async (name) => {
    name = validateString(name, "Username").toLowerCase();

    const data = await userData.users();
    const user = await data.findOne({username: name});

    if (!user) throw "User not found";
    
    // Assuming friends is an array in your user document
    return user.friends || [];
}