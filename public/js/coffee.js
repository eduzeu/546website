document.getElementById('coffeeCheckBox').addEventListener('change', async function () {
  if (this.checked) {
    try {
      const response = await fetch("/get-coffee");
      const data = await response.json();

      const reviews = await fetch('/get-review');
      const revData = await reviews.json();

      const locationContainer = document.getElementById('coffeeLocations');
      locationContainer.innerHTML = '';

      // Display locations if any are returned
      if (data && data.elements && data.elements.length > 0) {
        const table = document.createElement('table');
        table.style.width = '30%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr>
            <th style="border: 1px solid black; padding: 10px;">Coffee Shop Location</th>
            <th style="border: 1px solid black; padding: 10px;">Ratings & Reviews</th>
          </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.elements.forEach(location => {
          const row = document.createElement('tr');

          // First cell: Coffee shop details
          const coffeeDetailsCell = document.createElement('td');
          coffeeDetailsCell.style.border = '1px solid black';
          coffeeDetailsCell.innerHTML = `
            <strong>${location.tags.name}</strong><br>
            Place: ${location.tags['addr:housenumber']} ${location.tags['addr:street']}<br>
            City: ${location.tags['addr:city']}<br>
            Latitude: ${location.lat}<br>
            Longitude: ${location.lon} <br>
            Place id: ${location.id}
          `;

          const ratingsCell = document.createElement('td');
          ratingsCell.style.border = '1px solid black';

          const locationReviews = revData.filter(rev => rev.id === location.id);
        
          let allReviews = [];
          locationReviews.forEach(review => {
            review.text.forEach(rev => {
              allReviews.push(rev);
            });
          });

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
          seeReviews.innerHTML = `<a href="/reviews/${location.id}">See Reviews</a>`;

          const coffeeReview = document.createElement('p');
          coffeeReview.style.marginTop = '10px';
          coffeeReview.innerHTML = `<a id="review" href="#">Been here? Write a review</a>`;

          // Append cells to the row
          coffeeDetailsCell.appendChild(coffeeReview);
          ratingsCell.appendChild(seeReviews);
          row.appendChild(coffeeDetailsCell);
          row.appendChild(ratingsCell);

          // Append row to the table body
          tbody.appendChild(row);

          seeReviews.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            showReviews(allReviews);
          });

          coffeeReview.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            createReview(location.id);
          });
        });

        table.appendChild(tbody);
        locationContainer.appendChild(table);
      } else {
        locationContainer.textContent = 'No coffee shops found.';
      }
    } catch (error) {
      console.error('Error fetching coffee shops:', error);
    }
  } else {
    document.getElementById('coffeeLocations').innerHTML = '';
  }
});