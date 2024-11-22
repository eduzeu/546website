
document.getElementById('wifiCheckbox').addEventListener('change', async function () {
  if (this.checked) {
    try {
      const response = await fetch('../wifi');
      const data = await response.json();

      const reviews = await fetch('../review/wifi');
      const revData = await reviews.json();

      const locationContainer = document.getElementById('wifiLocations');
      locationContainer.innerHTML = ''; 

      // Display locations if any are returned
      if (Object.keys(data).length > 0) {
        const table = document.createElement('table');
        table.style.width = '30%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr>
            <th style="border: 1px solid black; padding: 10px;">Wi-Fi Location</th>
            <th style="border: 1px solid black; padding: 10px;">Ratings & Reviews</th>
          </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        Object.values(data).forEach(location => {
          const row = document.createElement('tr');

          // First cell: Wi-Fi details
          const wifiDetailsCell = document.createElement('td');
          wifiDetailsCell.style.border = '1px solid black';
          wifiDetailsCell.innerHTML = `
            <strong>${location['Wifi name']}</strong><br>
            Place: ${location.Place}<br>
            Neighborhood: ${location.Neighborhood}<br>
            Latitude: ${location.Latitude}<br>
            Longitude: ${location.Longitude} <br>
            Place id: ${location.place_id}
          `;
          const ratingsCell = document.createElement('td');
          ratingsCell.style.border = '1px solid black';

          const locationReviews = revData.filter(rev => rev.id === location.place_id);
        
          let allReviews = [];
          locationReviews.forEach(review => {
            review.text.forEach(rev => {
              allReviews.push(rev);
            });
          });

          // console.log(allReviews);

          if (locationReviews.length > 0) {
            let total = 0;
            let ratingCount = 0;

            // Loop through each review's ratings array
            locationReviews.forEach(item => {
              item.rating.forEach(rating => {
                total += rating; // Sum all ratings for this review
              });
              ratingCount += item.rating.length; // Count the number of ratings
            });

            if (ratingCount > 0) {
              const avg = total / ratingCount; // Calculate the average
              ratingsCell.innerHTML = `
                <strong>Average Rating:</strong> ${avg.toFixed(1)} (${ratingCount} reviews)<br>
              `;
            } else {
              ratingsCell.innerHTML = `
                <strong>Rating:</strong> No valid ratings<br>
                <strong>Reviews:</strong> No reviews yet
              `;
            }
          } else {
            ratingsCell.innerHTML = `
              <strong>Rating:</strong> Not rated yet<br>
              <strong>Reviews:</strong> No reviews yet
            `;
          }

          const seeReviews = document.createElement('p');
          seeReviews.style.marginTop = '10px';
          seeReviews.innerHTML = `<a href="/reviews/${location.place_id}">See Reviews</a>`;

    
          const wifiReview = document.createElement('p');
          wifiReview.style.marginTop = '10px';
          wifiReview.innerHTML = `<a class="review" href="#">Been here? Write a review</a>`;

          // Append cells to the row
          wifiDetailsCell.appendChild(wifiReview);
          ratingsCell.appendChild(seeReviews);
          row.appendChild(wifiDetailsCell);
          row.appendChild(ratingsCell);
          //row.appendChild(wifiReview);

          // Append row to the table body
          tbody.appendChild(row);

          seeReviews.querySelector('a').addEventListener('click', () => {
            event.preventDefault();
            showReviews(allReviews);

          })

          wifiReview.querySelector('a').addEventListener('click', () => {
            event.preventDefault();
            createReview(location.place_id, "wifi");
          });
        });

        table.appendChild(tbody);
        locationContainer.appendChild(table);
      } else {
        locationContainer.textContent = 'No Wi-Fi locations found.';
      }
    } catch (error) {
      console.error('Error fetching Wi-Fi locations:', error);
    }
  } else {
    document.getElementById('wifiLocations').innerHTML = '';
  }
});

const callReview = async (score, text, id, type) => {
  const numericScore = Number(score);
  try {
    const response = await fetch('../review', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',   
      },
      body: JSON.stringify({ rating: numericScore , text: text, id: id, type: type }),  
    });   
    // console.log(response);
  } catch (error) {
    throw new Error('Failed to submit the review'); 
  }
};

const showReviews = (revs) => {
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
  const structure = document.createElement('div');
  structure.className = 'modal';


  structure.innerHTML = `
    <input type="number" id="reviewScore" placeholder="Enter score (1-5)" min="1" max="5" style="margin-bottom: 10px; width: 90%;"><br>
    <textarea  id="reviewText" rows="4" cols="30" placeholder="Enter your review here"></textarea><br><br>
    <button id="submitReviewButton">Submit</button>
    <button id="closeButton">Close</button>
  `;

  document.body.appendChild(structure);

  document.getElementById('submitReviewButton').addEventListener('click', async () => {
    let userScore = document.getElementById('reviewScore').value;
    let userText = document.getElementById('reviewText').value.trim();

    // Add validation checks
    if (!userScore || isNaN(userScore) || userScore < 1 || userScore > 5) {
      alert('Please enter a valid score between 1 and 5.');
      return;
    }

    if (!userText) {
      alert('Please enter a review text.');
      return;
    }

    let score = parseInt(userScore, 10);
    let text = userText;

    try {
       await callReview(score, text, id, type);
 
      document.body.removeChild(structure); // Close the review form
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review.');
    }
  });
    document.getElementById('closeButton').addEventListener('click', () => {
    document.body.removeChild(structure); // Close the review form
  });
};
