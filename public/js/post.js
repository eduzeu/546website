const postButton = document.getElementById("postButton");
const commentPrompt = document.getElementById("reviewPrompt");
const cancelButton = document.getElementById("cancelButton");
const reviewForm = document.getElementById("reviewForm");
const userComments = document.getElementById("userComments");
const submitButton = document.getElementById("submitCommentButton");
const postId = document.getElementById("postId");
const username = document.getElementById("username");
const addFriendButton = document.getElementById("addFriend");

const userData = JSON.parse(document.getElementById('userData').value);
let imageUrl = undefined;
let posterUsername = username.textContent;

addFriendButton.addEventListener("click", async () => {
  hideAddFriend();
  try{
    posterUsername = validateString(posterUsername, "Poster Username");
    await fetch('/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({poster: posterUsername})
    });
  } catch (e) {
    throw e;
  }
})

postButton.addEventListener("click", () => {
  commentPrompt.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
  commentPrompt.classList.add("hidden");
  reviewForm.reset();
});

const hideAddFriend = () => {
  //console.log("removing button");
  addFriendButton.classList.add("hidden");
  //console.log(addFriendButton);
}

const displayReviews = async () => {
  try {
    let id = postId.textContent;

    try {
      id = validateObjectId(id, "Post ID")
    } catch (e) {
      throw new Error(e);
    }

    const comments = await fetch(`/comments/${id}`);
    if (!comments.ok) throw new Error("Failed to fetch reviews.");
    const data = await comments.json();
    //console.log("Fetched comments:", data);

    userComments.innerHTML = ""; 

    data.forEach((user) => {
      if (user) {
        //console.log(user);
        const isCurrentUser = posterUsername === userData.username;
        const isFriend = userData.friends && userData.friends.includes(posterUsername);
        if(!isCurrentUser && !isFriend){
          addFriendButton.classList.remove("hidden");
        }
        else{
          addFriendButton.classList.add("hidden");
        }
        const revDiv = document.createElement("div");
        revDiv.classList.add("comment");
        // if (user.imageUrl) {
        //   revDiv.innerHTML = `
        //   <div class="review-header">
        //     <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
        //     <span class="username">by ${user.user.username || "Anonymous"}</span>
        //   </div>
        //   <p class="review-text">${user.body || "No review text"}</p>
        //   <img class="review-image" src="${user.imageUrl}" alt="Review Image">
        //   `;
        // } else {
        //   revDiv.innerHTML = `
        //   <div class="review-header">
        //     <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
        //     <span class="username">by ${user.user.username || "Anonymous"}</span>
        //   </div>
        //   <p class="review-text">${user.body || "No review text"}</p>
        // `;
        // }
        // userComments.appendChild(revDiv);
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    userComments.innerHTML = "<p>Failed to load reviews. Please try again later.</p>";
  }
};

const displayComments = async (parentId) => {
  try {
    parentId = validateObjectId(parentId, "Parent ID")

    const commentsResponse = await fetch(`/comments/${parentId}`);

    if (!commentsResponse.ok) throw new Error("Failed to fetch comments.");
    const comments = await commentsResponse.json();


    //console.log("Fetched comments for parent:", comments);

    userComments.innerHTML = ""; 
    comments.reverse().forEach((comment) => { 
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");
      commentDiv.innerHTML = `
        <div class="comment-header">
          <span class="username">${comment.commenter.name || "Anonymous"}</span>
        </div>
        <p class="comment-text">${comment.body || "No comment text"}</p>
      `;
      userComments.appendChild(commentDiv);
    });
  } catch (error) {
    console.error("Error displaying comments:", error);
    userComments.innerHTML = "<p>Failed to load comments. Please try again later.</p>";
  }
};

const makeComment = async () => {
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let id = postId.textContent;
    let reviewText = document.getElementById("reviewText").value;

    try {
      id = validateStringId(id, "Post Id");
      reviewText = validateString(reviewText, "Review Text");
    } catch (e) {
      alert("Please enter a comment before submitting.");
      return;
    }

    const commentPayload = { parent: id, body: reviewText };
    //console.log("Submitting comment:", commentPayload);

    try {
      await InsertComment(commentPayload);
      reviewForm.reset();
      commentPrompt.classList.add("hidden"); 
      displayComments(id); 
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  });
};

const InsertReview = async (object) => {
  try {
    validateObject(object, "Review Object");
    object.id = validateObjectId(object.id, "Post ID");
    object.body = validateString(object.body, "Review Body");

    const response = await fetch("/userFeed/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(object),
    });
    if (!response.ok) throw new Error("Failed to insert review");
    //console.log("Review inserted successfully.");
  } catch (error) {
    console.error("Error inserting review:", error);
  }
};

const InsertComment = async (object) => {
  //console.log("Inserting comment:", object);
  try {
    validateObject(object, "Review Object");
    object.id = validateObjectId(object.id, "Post ID");
    object.body = validateString(object.body, "Review Body");

    const response = await fetch("/comments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(object),
    });

    if (!response.ok) {
      throw new Error("Failed to insert comment");
    }

    const data = await response.json();
    //console.log("Comment inserted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error inserting comment:", error);
    throw error;
  }
};

displayReviews();
displayComments(postId.textContent); // Display comments on page load
makeComment();
