(function ($) {
  let postButton = $("#postButton")
  let reviewPrompt = $("#reviewPrompt")
  let cancelButton = $("#cancelButton")
  let reviewForm = $("#reviewForm")
  let userPosts = $("#userPosts")
  let uploadWidget = $("#upload_widget")
  let imagePreview = $("#imagePreview")
  let imageAltLabel = $("#imageAltLabel")
  let imageAltText = $("#imageAltText")
  let errorText = $("#errorText")
  let placeName = $("#placeName")
  let reviewText = $("#reviewText")
  let removeImg = $("#removeImage")

  uploadWidget.html("Upload image");
  imagePreview.css("display", "none");
  imageAltLabel.css("display", "none");
  removeImg.css("display", "none");

  let imageUrl = undefined;

  const userData = JSON.parse(document.getElementById('userData').value);

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
              imagePreview.attr("src", imageUrl);
              uploadWidget.html("Replace image");
              imagePreview.css("display", "");
              imageAltLabel.css("display", "");
              removeImg.css("display", "");

          } else if (error) {
              errorText.html(error.message);
              errorText.removeClass("hidden");
          }
      }
  );

  const displayReviews = async () => {
      $.ajax({
          url: "/posts",
          method: "GET",
          contentType: "application/json",
          success: function (response) {
              console.log("Fetched reviews:", response);
              userPosts.html("");

              response.forEach(user => {
                  if (user && user.poster) {
                      console.log("Individual review:", user.poster);

                      const revDiv = $("<div>").addClass("review");

                      const isCurrentUser = user.poster.username === userData.username;
                      const isFriend = userData.friends && userData.friends.includes(user.poster.username);
                      console.log("Is current user:", isCurrentUser);
                      //  console.log("Is friend:", isFriend);

                      const addFriendButton = (!isCurrentUser && !isFriend) ? 
                          `<button id="addFriend" data-userid="${user.poster.username}"> +Friend </button>` : 
                          '';

                      revDiv.html(`
                      <div class="review-header">
                          <h3 class="place-name">${user.placeName || "Unknown Place"}</h3>
                          ${addFriendButton}
                          <span class="username">by ${user.poster.username || "Anonymous"}</span>
                      </div>
                      <p class="review-text">${user.body || "No review text"}</p>
                      ${user.image ? `<img class="review-image" src="${user.image.url}" alt="${user.image.altText}">` : ""}
                      <a href="/posts/${user._id}">View/Add Comments</a>
                      `);

                      userPosts.append(revDiv);

                  } else {
                      console.warn("Missing poster or user details:", user);
                  }
              });
          },
          error: function (xhr, status, error) {
              console.error("Error fetching reviews:", e);
              errorText.html(error);
              errorText.removeClass("hidden");
          }
      });
  }

  postButton.click(() => {
      reviewPrompt.removeClass("hidden");
      postButton.addClass("hidden");
  })

  cancelButton.click(() => {
      reviewPrompt.addClass("hidden");
      postButton.removeClass("hidden");
      reviewForm.trigger("reset");
  })

  removeImg.click(() => {
      imageUrl = undefined;
      imagePreview.attr("src", "Placeholder");
      imageAltText.val("");
      imageAltLabel.css("display", "none");
      imagePreview.css("display", "none");
      removeImg.css("display", "none");
      uploadWidget.html("Upload image");
  })

  reviewForm.submit((event) => {
      if (event.originalEvent.submitter === uploadWidget.get(0)) {
          event.preventDefault();
          return;
      }

      event.preventDefault();
      errorText.html("");
      errorText.addClass("hidden");

      try {
          placeName.val(validateString(placeName.val(), "Place Name"));
          reviewText.val(validateString(reviewText.val(), "Review Text"));
          if (imageUrl) {
              imageUrl = validateCloudinaryUrl(imageUrl, "Image URL");
              imageAltText.val(validateString(imageAltText.val(), "Image Alt Text"));
          }
      } catch (e) {
          errorText.html(e);
          errorText.removeClass("hidden");
          return;
      }

      let revObject = {
          placename: placeName.val(),
          reviewText: reviewText.val()
      }

      if (imageUrl) {
          revObject["imageUrl"] = imageUrl;
          revObject["imageAltText"] = imageAltText.val();
      }

      console.log("inserting review", revObject);

      $.ajax({
          url: "/posts",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(revObject),
          success: function (response) {
              console.log("Review inserted successfully:", response);

              reviewForm.trigger("reset");
              imageUrl = undefined;
              imagePreview.attr("src", "Placeholder");
              imageAltLabel.css("display", "none");
              imageAltText.val("");
              imagePreview.css("display", "none");
              removeImg.css("display", "none");
              uploadWidget.html("Upload image");
              reviewPrompt.addClass("hidden");
              postButton.removeClass("hidden");
      
              displayReviews();
          },
          error: function (xhr, status, error) {
              console.error("Error inserting review:", error);
              errorText.html(error);
              errorText.removeClass("hidden");
          }
      });
  })

  uploadWidget.click(function () {
      myWidget.open();
  });

  displayReviews();

})(jQuery);