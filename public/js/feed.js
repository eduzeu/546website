// Get references to the necessary elements
const postButton = document.getElementById("postButton");
const reviewPrompt = document.getElementById("reviewPrompt");
const cancelButton = document.getElementById("cancelButton");
const reviewForm = document.getElementById("reviewForm");
const userPosts = document.getElementById("userPosts");
const uploadWidget = document.getElementById("upload_widget");
let imagePreview = document.getElementById("imagePreview");
const submitButton = document.getElementById("submitReviewButton");
let errorText = document.getElementById("error");
let placeName = document.getElementById("placeName");
let reviewText = document.getElementById("reviewText");
const removeImg = document.getElementById("removeImage");
// console.log(postButton, reviewPrompt, cancelButton, reviewForm);

uploadWidget.innerHTML = "Upload image"
imagePreview.style.display = "none";
let imageUrl = undefined;

var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: cloudinaryConfig.cloudName,
    uploadPreset: cloudinaryConfig.uploadPreset,
    sources: ["local", "url", "camera"],
    multiple: false,
    maxFiles: 1,
    clientAllowedFormats: "image",
    singleUploadAutoClose: false
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      imageUrl = result.info.url;
      imagePreview.src = imageUrl;
      uploadWidget.innerHTML = "Replace image";
      imagePreview.style.display = "";
      removeImg.removeAttribute("hidden");
    
    } else if (error) {
      errorText.innerHTML = error.message;
      errorText.classList.remove("hidden");
    }
  }
);

// Event listener for the post button
const displayReviews = async () => {
  try {
    const reviews = await fetchFrom("../userFeed/posts");

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
        if (user.image) {
          revDiv.innerHTML = `
          <div class="review-header">
            <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
            <span class="username">by ${user.username || "Anonymous"}</span>
          </div>
          <p class="review-text">${user.body || "No review text"}</p>
          <img class="review-image" src="${user.image}" alt="Review Image">
          <a href="/userFeed/${user._id}">View/Add Comments</a>
        `;
        } else {
          revDiv.innerHTML = `
          <div class="review-header">
            <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
            <span class="username">by ${user.username || "Anonymous"}</span>
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
    errorText.innerHTML = error;
    errorText.classList.remove("hidden");
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

removeImg.addEventListener("click", () => {
  imageUrl = undefined;
  imagePreview.src = "";
  imagePreview.style.display = "none";
  removeImg.classList.add("hidden");
  uploadWidget.innerHTML = "Upload image"
});

reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorText.innerHTML = "";
  errorText.classList.add("hidden");

  try {
    placeName.value = validateString(placeName.value, "Place Name");
    reviewText.value = validateString(reviewText.value, "Review Text");
    if (imageUrl) { imageUrl = validateCloudinaryUrl(imageUrl, "Image URL"); }
  } catch (e) {
    errorText.innerHTML = e;
    errorText.classList.remove("hidden");
    return;
  }

  // const rating = document.getElementsByClassName("star-rating").value;
  //find a way to get the id based on cookies and pass to insertUserReview
  let revObject = { placename: placeName.value, reviewText: reviewText.value };
  if (imageUrl) { revObject["imageUrl"] = imageUrl }

  console.log("inserting review", revObject);
  InsertReview(revObject); //inserts review to database

  reviewForm.reset();
  imageUrl = undefined;
  imagePreview.src = "";
  imagePreview.style.display = "none";
  removeImg.classList.add("hidden");
  uploadWidget.innerHTML = "Upload image"
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
