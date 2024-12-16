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
    let noneCheckbox = $("#none-checkbox")
    let wifiCheckbox = $("#wifi-checkbox")
    let coffeeCheckbox = $("#coffee-checkbox")
    let eventCheckbox = $("#event-checkbox")
    let locationSearchOptions = $("#locationSearchOptions")
    let locationSearchLabel = $("#locationSearchLabel")
    let locationSearchBar = $("#locationSearch")

    noneCheckbox.prop("checked", true);
    locationSearchLabel.css("display", "none");
    uploadWidget.html("Upload image");
    imagePreview.css("display", "none");
    imageAltLabel.css("display", "none");
    removeImg.css("display", "none");

    let imageUrl = undefined;
    let locationDetails = undefined;

    // Upload Button Config
    // Actions upon upload and error
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
        // Make a GET request to /posts
        $.ajax({
            url: "/posts",
            method: "GET",
            contentType: "application/json",
            success: function (response) {
                // if successful
                console.log("Fetched reviews:", response);
                userPosts.html("");

                response.forEach(user => {
                    // If user exists and has a poster
                    // add new div with review info
                    if (user && user.poster) {
                        console.log("Individual review:", user.poster);

                        const revDiv = $("<div>").addClass("review");

                        revDiv.html(`
                      <div class="review-header">
                          <h3 class="place-name">${user.title || "A Post"}</h3>
                          <span class="username">by ${user.poster.username || "Anonymous"}</span>
                      </div>
                      <p class="review-text">${user.body || "No review text"}</p>
                      ${user.location ? `<p>${user.location.name}</p>` : ""}
                      ${user.location && user.location.detail ? `<p>${user.location.detail}</p>` : ""}
                      ${user.image ? `<img class="review-image" src="${user.image.url}" alt="${user.image.altText}">` : ""}
                      <a href="/posts/${user._id}">View/Add Comments</a>
                      `);

                        userPosts.append(revDiv);

                    // If not
                    } else {
                        console.warn("Missing poster or user details:", user);
                    }
                });
            },
            // If error occurs:
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

    locationSearchBar.on("change", () => {
        // Get the value of the search bar
        const value = locationSearchBar.val();
        
        // Get the current option
        const option = locationSearchOptions.find(`option[value="${value}"]`);

        // Gets its id (for the location  id)
        const id = option.attr("data-id");

        // If exists
        if (id) {
            // If wifi
            if (wifiCheckbox.prop("checked")) {
                locationDetails = {
                    type: "wifi",
                    id: id,
                    name: option.val()
                }

            // If coffee
            } else if (coffeeCheckbox.prop("checked")) {
                let [name, ...rest] = option.val().split(",")
                rest = rest.map(str => str.trim()).join(", ")

                locationDetails = {
                    type: "coffee",
                    id: id,
                    name: name,
                    detail: rest
                }

            // If event
            } else if (eventCheckbox.prop("checked")) {
                let [name, ...rest] = option.val().split(",")
                rest = rest.map(str => str.trim()).join(", ")

                locationDetails = {
                    type: "event",
                    id: id,
                    name: name,
                    detail: rest
                }
            }
        }
    })

    // None Checkbox
    noneCheckbox.on("change", () => {
        if (noneCheckbox.prop("checked")) {
            locationSearchBar.val("");
            locationSearchLabel.css("display", "none");
            locationSearchOptions.html("");
        }
    })

    // Coffee Checkbox
    coffeeCheckbox.on("change", async () => {
        // If it is not checked, do nothing
        if (!coffeeCheckbox.prop("checked")) {
            return;
        }

        // Reset values
        locationSearchOptions.html("");
        locationSearchBar.val("");

        // Perform GET request to /location/coffeeShop
        $.ajax({
            url: "/location/coffeeShop",
            method: "GET",
            contentType: "application/json",
            success: function (response) {
                // Show search bar
                locationSearchLabel.css("display", "");

                console.log("Fetched coffee shops:", response);

                // Populate options for autocomplete
                response.elements.forEach(coffeeShop => {
                    let option = $("<option>");
                    option.attr("data-id", coffeeShop.id);
                    option.val(`${coffeeShop.tags.name}, ${coffeeShop.tags['addr:housenumber']} ${coffeeShop.tags['addr:street']}, ${coffeeShop.tags['addr:city']}`);
                    locationSearchOptions.append(option);
                });
            },
            // If error
            error: function (xhr, status, error) {
                errorText.html(e);
                errorText.removeClass("hidden");
                return;
            }
        })
    })

    // Wifi Checkbox
    wifiCheckbox.on("change", () => {
        // If it is not checked, do nothing
        if (!wifiCheckbox.prop("checked")) {
            return;
        }

        // Reset elements
        locationSearchOptions.html("");
        locationSearchBar.val("");

        // GET request to /location/wifi/names
        $.ajax({
            url: "/location/wifi/names",
            method: "GET",
            contentType: "application/json",
            success: function (response) {
                locationSearchLabel.css("display", "");

                console.log("Fetched wifi names:", response);

                locationSearchOptions.html("");

                // Populate options for autocomplete
                response.forEach(wifi => {
                    let option = $("<option>");
                    option.attr("data-id", wifi.oid);
                    option.val(wifi.public_space_open_space_name);
                    locationSearchOptions.append(option);
                });
            },
            // If error
            error: function (xhr, status, error) {
                errorText.html(e);
                errorText.removeClass("hidden");
                return;
            }
        })
    })

    eventCheckbox.on("change", () => {
        // If it is not checked, do nothing
        if (!eventCheckbox.prop("checked")) {
            return;
        }

        locationSearchOptions.html("");
        locationSearchBar.val("");

        // GET request to /location/events/names
        $.ajax({
            url: "/location/events/names",
            method: "GET",
            contentType: "application/json",
            success: function (response) {
                locationSearchLabel.css("display", "");

                console.log("Fetched event names:", response);

                // Populate options for autocomplete
                response.forEach(event => {
                    let option = $("<option>");
                    option.val(`${event.event_name}, ${event.event_location}`);
                    option.attr("data-id", event.event_id);
                    locationSearchOptions.append(option);
                });
            },
            // If error
            error: function (xhr, status, error) {
                errorText.html(e);
                errorText.removeClass("hidden");
                return;
            }
        })
    })

    reviewForm.submit((event) => {
        // If Cloudinary button used, will submit
        // If it is the trigger, ignore
        if (event.originalEvent.submitter === uploadWidget.get(0)) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        errorText.html("");
        errorText.addClass("hidden");

        try {
            // Validate requirements
            placeName.val(validateString(placeName.val(), "Place Name"));
            reviewText.val(validateString(reviewText.val(), "Review Text"));

            // If has image info, validate
            if (imageUrl) {
                imageUrl = validateCloudinaryUrl(imageUrl, "Image URL");
                imageAltText.val(validateString(imageAltText.val(), "Image Alt Text"));
            }

            // If has location info, validate
            if (locationDetails) {
                locationDetails = validateLocationPostDetails(locationDetails, "Location Details");
                locationDetails.id = `${locationDetails.id}`;
            }

        } catch (e) {
            errorText.html(e);
            errorText.removeClass("hidden");
            return;
        }

        // Set revObject with required params
        let revObject = {
            title: placeName.val(),
            reviewText: reviewText.val()
        }

        // If has image data set properties
        if (imageUrl) {
            revObject["image"] = {
                url: imageUrl,
                altText: imageAltText.val()
            }
        }

        // If has location data set properties
        if (locationDetails) {
            revObject["location"] = locationDetails
        }

        console.log("inserting review", revObject);

        // Make POST request to /posts
        $.ajax({
            url: "/posts",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(revObject),
            // If sucessful
            success: function (response) {
                console.log("Review inserted successfully:", response);

                // Reset/Hide values
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

                // Display new review
                displayReviews();
            },
            // If error
            error: function (xhr, status, error) {
                console.error("Error inserting review:", error);
                errorText.html(error);
                errorText.removeClass("hidden");
            }
        });
    })

    // Set widget action
    uploadWidget.click(function () {
        myWidget.open();
    });

    // Display review on first run
    displayReviews();

})(jQuery);