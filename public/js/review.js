const callReview = async (score, text, id, type) => {
    try {
        score = validateNumber(score, "Review Score");
        text = validateString(text, "Review Text");
        id = validateNumber(id, "Location ID");
        type = validateReviewType(type, "Review Type");

    } catch (e) {
        throw e;
    }

    try {
        await fetchFrom('../review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: score, text: text, id: id, type: type }),
        })
        // console.log(response);
    } catch (error) {
        throw 'Failed to submit the review';
    }
};

const updateReview = async (id, type) => {
    try {
        id = validateNumber(id, "Location ID");
        type = validateReviewType(type, "Review Type");

    } catch (error) {
        throw error;
    }

    try {
        const reviews = await fetchFrom(`../review/${type}/${id}`);

        console.log("Reviews data:", reviews); // Log the structure of the reviews

        const locationRow = document.getElementById(`${type}Locations`).querySelector(`td[data-location-id="${id}"]`); // Target the correct location by place_id

        if (locationRow) {
            const reviewCell = locationRow;

            // Initialize rating calculation variables
            let total = 0;
            let ratingCount = 0;

            // Handle the reviews object: reviews.rating is an array of ratings
            if (Array.isArray(reviews.rating)) {
                reviews.rating.forEach((rating) => {
                    total += rating;
                    ratingCount++;
                });
            } else {
                console.error("Reviews.rating is not an array.");
                return; // Exit early if reviews.rating is not an array
            }

            // Update the rating display
            if (ratingCount > 0) {
                const avg = total / ratingCount;
                reviewCell.innerHTML = `
            <strong>Average Rating:</strong> ${avg.toFixed(1)} (${ratingCount} reviews)<br>
          `;
            } else {
                reviewCell.innerHTML = `
            <strong>Rating:</strong> Not rated yet<br>
            <strong>Reviews:</strong> No reviews yet
          `;
            }

            if (type === 'wifi') {
                const seeReviews = document.createElement('p');
                seeReviews.style.marginTop = '10px';
                seeReviews.innerHTML = `<a href="/reviews/${id}">See Reviews</a>`;
                reviewCell.appendChild(seeReviews);
                seeReviews.querySelector('a').addEventListener('click', (event) => {
                    event.preventDefault();
                    showReviews(reviews.text); // Pass the reviews for this location
                });
            }


        } else {
            console.error(`Couldn't find row for location ID: ${id}`);
        }
    } catch (e) {
        console.error("Error updating reviews:", e);
    }
};

const showReviews = (revs) => {
    try {
        validateReviewsArray(revs, "Reviews");
    } catch (error) {
        throw error;
    }

    const structure = document.createElement('div');
    structure.className = 'modal';

    const exit = document.createElement('button');
    exit.textContent = 'Exit';
    exit.className = 'exit-button';

    exit.addEventListener('click', () => {
        document.body.removeChild(structure);
    });

    const reviewContainer = document.createElement('div');
    reviewContainer.className = 'review-container';

    if (revs.length === 0) {
        // If no reviews, display a message
        const noReviewsMessage = document.createElement('p');
        noReviewsMessage.textContent = 'No reviews added yet!';
        noReviewsMessage.className = 'review-text';
        reviewContainer.appendChild(noReviewsMessage);
    } else {
        // If reviews exist, display them
        revs.forEach((rev) => {
            const revText = document.createElement('p');
            revText.textContent = rev;
            revText.className = 'review-text';
            reviewContainer.appendChild(revText);
        });
    }

    structure.appendChild(exit);
    structure.appendChild(reviewContainer);

    document.body.appendChild(structure);
};

const createReview = (id, type) => {
    try {
        id = validateNumber(id, "Location ID");
        type = validateReviewType(type, "Review Type");

    } catch (error) {
        throw error;
    }

    const structure = document.createElement('div');
    structure.className = 'modal';
    structure.innerHTML = `
      <div style="text-align: center;">
        <p style="font-size: 1.2rem;">Rate this location:</p>
        <div class="star-rating" id="starRating">
          <span class="star" data-value="1">&#9733;</span>
          <span class="star" data-value="2">&#9733;</span>
          <span class="star" data-value="3">&#9733;</span>
          <span class="star" data-value="4">&#9733;</span>
          <span class="star" data-value="5">&#9733;</span>
        </div>
      </div>
      <textarea id="reviewText" rows="4" cols="30" placeholder="Enter your review here" style="margin-top: 20px;"></textarea><br><br>
      <button id="submitReviewButton">Submit</button>
      <button id="closeButton">Close</button>
    `;
    document.body.appendChild(structure);
    const stars = structure.querySelectorAll('.star');
    let selectedRating = 0;
    stars.forEach((star) => {
        star.addEventListener('click', () => {
            stars.forEach((s) => s.classList.remove('selected'));
            star.classList.add('selected');
            let current = star.previousElementSibling;
            while (current) {
                current.classList.add('selected');
                current = current.previousElementSibling;
            }
            selectedRating = parseInt(star.getAttribute('data-value'), 10);
        });
    });

    document.getElementById('submitReviewButton').addEventListener('click', async () => {
        const userText = document.getElementById('reviewText').value.trim();

        // Add validation checks
        if (selectedRating === 0) {
            alert('Please select a rating.');
            return;
        }

        if (!userText) {
            alert('Please enter a review text.');
            return;
        }

        try {
            await callReview(selectedRating, userText, id, type);
            document.body.removeChild(structure); // Close the review form
            updateReview(id, type);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('There was an error submitting your review.');
        }
    });

    document.getElementById('closeButton').addEventListener('click', () => {
        document.body.removeChild(structure); // Close the review form
    });
};