// Get references to the necessary elements
const postButton = document.getElementById("postButton");
const reviewPrompt = document.getElementById("reviewPrompt");
const cancelButton = document.getElementById("cancelButton");
const reviewForm = document.getElementById("reviewForm");
const userPosts = document.getElementById("userPosts");
const uploadWidget = document.getElementById("upload_widget");
const imagePreview = document.getElementById("imagePreview");
const submitButton = document.getElementById("submitReviewButton");
// console.log(postButton, reviewPrompt, cancelButton, reviewForm);

let imageUrl = undefined;

var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: "dcvqjizwy",
    uploadPreset: "post_preset",
    sources: ["local", "url", "camera"],
    multiple: false,
    maxFiles: 1,
    clientAllowedFormats: "image",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      imageUrl = result.info.url;
    }
  }
);

// Event listener for the post button
const displayReviews = async () => {
  try {
    const reviews = await fetchFrom("../userFeed/getPosts");

    console.log("Fetched reviews:", reviews);

    userPosts.innerHTML = ""; // Clear the previous content

    reviews.forEach((user) => {
      // Check if user.reviews exists and is an array
      console.log("in for");
      if (user) {
        // Log the review to see its exact structure
        console.log("Individual review:", user);

        const revDiv = document.createElement("div");
        revDiv.classList.add("review");

        // Adjust these based on the actual structure of your review object
        if (user.imageUrl) {
          revDiv.innerHTML = `
          <div class="review-header">
            <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
            <span class="username">by ${user.user.username || "Anonymous"}</span>
          </div>
          <p class="review-text">${user.body || "No review text"}</p>
          <img class="review-image" src="${user.imageUrl}" alt="Review Image">
          <a href="/userFeed/${user._id}"></a>
        `;
        } else {
          revDiv.innerHTML = `
          <div class="review-header">
            <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
            <span class="username">by ${user.user.username || "Anonymous"}</span>
          </div>
          <p class="review-text">${user.body || "No review text"}</p>
          <a href="/userFeed/post/${user._id}">View/Add Comments</a>
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

reviewForm.addEventListener("submit", async (event) => {
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

uploadWidget.addEventListener(
  "click",
  function () {
    myWidget.open();
  },
  false
);

displayReviews();

const InsertReview = async (object) => {
  await fetch("/userFeed/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
};
