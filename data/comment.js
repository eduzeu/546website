import { ObjectId } from "mongodb";
import { comment, posts } from "../config/mongoCollections.js";
import { validateCommenter, validateObjectIdArray, validateObjectIdString, validateParent, validateString } from "../helpers.js";
import { findPostById } from "./posts.js";

// import { reviews } from "../config/mongoCollections.js";
// import { users } from "../config/mongoCollections.js";

// const userCollection = await users();

// notes, i n

export const createComment = async (commenter, parent, body, comments) => {
    // validate stuff
    commenter = validateCommenter(commenter, 'Commenter')
    parent = validateParent(parent, 'Comment Parent');
    body = validateString(body, 'Comment Body');
    comments = validateObjectIdArray(comments, 'Comments Array')

    const commentCollection = await comment();
    // create comment obj:
    const newComment = await commentCollection.insertOne({
        _id: new ObjectId(),
        commenter,
        parent,
        body,
        comments
    });

    const insertInfo = await commentCollection.insertOne(newComment);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add comment";

    const newCommentId = insertInfo.insertedId;

    // parent.type validated in validation function
    if (parent.type === "comment") {
        await updateCommentsComment(newCommentId);

    } else if (parent.type === "post") {
        await updateCommentsPost(newCommentId);
    }

    return await findCommentById(newCommentId.toString());
}

// console.log(await createComment("675b72b6f057d21224af3924", ""))

export const findCommentById = async (id) => {
    id = validateObjectIdString(id, "Comment Id")
    const commentCollection = await comment();
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (comment === null) throw 'No comment with that id';
    comment._id = comment._id.toString();
    return comment;
}

// used to add comments to the parent if the parent is a comment
export const updateCommentsComment = async (commentId) => {
    commentId = validateObjectIdString(commentId, "Comment Id");

    const commentCollection = await comment();

    const comment = await findCommentById(commentId);
    const parent_comment = await findCommentById(comment.parent.id);
    const updated_comments = [...parent_comment.comments, comment._id];

    const updatedInfo = await commentCollection.findOneAndUpdate(
        { _id: new ObjectId(parent_comment._id) },
        { $set: { comments: updated_comments } },
        { returnDocument: "after" }
    );

    if (!updatedInfo.value) throw "Could not update comment successfully";

    return updatedInfo.value;
}
// used to add comments to the parent if the parent is a post
export const updateCommentsPost = async (commentId) => {
    commentId = validateObjectIdString(commentId, "Comment Id");

    const postsCollection = await posts();
    // get the post and all its info
    const comment = await findCommentById(commentId);
    // find post by id --> FUNCTION IS NOT IMPLEMENTED YET
    const parent_post = await findPostById(comment.parent.id);
    const updated_comments = [...parent_comment.comments, comment._id];

    const updatedInfo = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(parent_post._id) },
        { $set: { comments: updated_comments } },
        { returnDocument: "after" }
    );
    if (!updatedInfo.value) throw "Could not update post successfully";

    return updatedInfo.value;
}