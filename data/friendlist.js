import * as userData from "../config/mongoCollections.js";
import { validateString } from "../helpers.js";

export const updateFriends = async (name, friend) => {

    name = validateString(name, "Username").toLowerCase();
    friend = validateString(friend, "Friend Username").toLowerCase();

    const data = await userData.users();
    const user = await data.findOne({username: name});

    if (!user) throw "User not found";

    if (user.friends.includes(friend)) throw "User is already a friend";

    //console.log(user.friends);

    const updateInfo = await data.updateOne(
        { username: name },
        { $push: { friends: friend } }
    );
    // const updatedUser = await data.findOne({username: name});

    // console.log(updatedUser.friends);

    return updateInfo;
}

//console.log(await updateFriends("sammy", "emmaxfreire"));