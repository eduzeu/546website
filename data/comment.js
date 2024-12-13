import { ObjectId } from "mongodb";
import { comment, posts } from "../config/mongoCollections.js";

// import { reviews } from "../config/mongoCollections.js";
// import { users } from "../config/mongoCollections.js";

// const userCollection = await users();

// notes, i n

export const createComment = async (commenter, parent, body, comments) => {
    // validate stuff
    if (!commenter || typeof commenter !== 'string') throw 'Invalid commenter';
    if (!parent || typeof parent !== 'object') throw 'Invalid parent';
    if (!body || typeof body !== 'string' || body.trim().length === 0) throw 'Invalid body';
    if (!comments || !Array.isArray(comments)) throw 'Invalid comments';

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

    // add new comment to parent's comments
    // const parentComment = findCommentById(newComment.parent.id);
    // change the parent's comments to add newComment
    if (!parent.type || (parent.type !== 'comment' && parent.type !== 'post')) {
        throw 'Parent type must be "comment" or "post"';
    }
    if (parent.type === "comment") {
        await updateCommentsComment(newCommentId);
    } else if (parent.type === "post") {
        await updateCommentsPost(newCommentId);
    } else {
        throw "Invalid parent type";
    }

    return await findCommentById(newCommentId.toString());
}

console.log(await createComment("675b72b6f057d21224af3924", ""))

export const findCommentById = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const commentCollection = await comment();
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (comment === null) throw 'No comment with that id';
    comment._id = comment._id.toString();
    return comment;
}

// used to add comments to the parent if the parent is a comment
export const updateCommentsComment = async (commentId) => {
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
    const postsCollection = await posts();
    // get the post and all its info
    const comment = await findCommentById(commentId);
    // find post by id --> FUNCTION IS NOT IMPLEMENTED YET
    const parent_post = findPostById(comment.parent.id);
    const updated_comments = [...parent_comment.comments, comment._id];

    const updatedInfo = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(parent_post._id) },
        { $set: { comments: updated_comments } },
        { returnDocument: "after" }
    );
    if (!updatedInfo.value) throw "Could not update post successfully";

    return updatedInfo.value;
}