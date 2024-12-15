import * as userData from "../config/mongoCollections.js";
import { validateString } from "../helpers.js";

export const updateFriends = async (name, friend) => {

    name = validateString(name, "Username").toLowerCase();
    friend = validateString(friend, "Friend Username").toLowerCase();

    const data = await userData.users();
    const user = await data.findOne({username: name});

    if (!user) throw "User not found";

    if (user.friends.includes(friend)) throw "User is already a friend";

    const updateInfo = await data.updateOne(
        { username: name },
        { $push: { friends: friend } }
    );

    return user.friends ;
}