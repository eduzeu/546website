// Get references to the necessary elements
const postButton = document.getElementById("postButton");
const commentPrompt = document.getElementById("reviewPrompt");
const cancelButton = document.getElementById("cancelButton");
const reviewForm = document.getElementById("reviewForm");
const userComments = document.getElementById("userComments");
const submitButton = document.getElementById("submitCommentButton");
const postId = document.getElementById("postId");
// console.log(postButton, reviewPrompt, cancelButton, reviewForm);

let imageUrl = undefined;

// Event listener for the post button
const displayReviews = async () => {
  try {
    const id = postId.textContent;
    const comments = await fetchFrom("/comments/" + id);
    console.log("Fetched comments:", comments);

    userComments.innerHTML = ""; // Clear the previous content

    comments.forEach((user) => {
      // Check if user.reviews exists and is an array
      console.log("in for");
      if (user) {
        // Log the review to see its exact structure
        console.log("Individual review:", user);

        const revDiv = document.createElement("div");
        revDiv.classList.add("comment");

        // Adjust these based on the actual structure of your review object
        if (user.imageUrl) {
          revDiv.innerHTML = `
          <div class="review-header">
            <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
            <span class="username">by ${user.user.username || "Anonymous"}</span>
          </div>
          <p class="review-text">${user.body || "No review text"}</p>
          <img class="review-image" src="${user.imageUrl}" alt="Review Image">
          <a href=""
        `;
        } else {
          revDiv.innerHTML = `
          <div class="review-header">
            <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
            <span class="username">by ${user.user.username || "Anonymous"}</span>
          </div>
          <p class="review-text">${user.body || "No review text"}</p>
        `;
        }
        userPosts.appendChild(revDiv);
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    userPosts.innerHTML =
      "<p>Failed to load reviews. Please try again later.</p>";
  }
};

postButton.addEventListener("click", () => {
  reviewPrompt.classList.remove("hidden");
});

// Event listener for the cancel button
cancelButton.addEventListener("click", () => {
  reviewPrompt.classList.add("hidden");
  reviewForm.reset();
});

reviewForm.addEventListener(submitButton, (event) => {
  event.preventDefault();

  let placeName = document.getElementById("placeName").value;
  let reviewText = document.getElementById("reviewText").value;

  // const rating = document.getElementsByClassName("star-rating").value;
  //find a way to get the id based on cookies and pass to insertUserReview
  let revObject = { placename: placeName, reviewText: reviewText };
  if (imageUrl) {
    revObject["imageUrl"] = imageUrl;
  }
  console.log("inserting review", revObject);
  InsertReview(revObject); //inserts review to database

  reviewForm.reset();
  reviewPrompt.classList.add("hidden");

  displayReviews();
});


displayReviews();

const InsertReview = async (object) => {
  await fetchFrom("/userFeed/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
};
