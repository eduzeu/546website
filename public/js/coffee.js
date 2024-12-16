document.getElementById('coffee-checkbox').addEventListener('change', async function () {
  if (this.checked) {
    try {
      document.getElementById('wifiLocations').innerHTML = '';

      const data = await fetchFrom("../location/coffeeShop");
      const revData = await fetchFrom("../review/coffee");

      const locationContainer = document.getElementById('coffeeLocations');
      locationContainer.innerHTML = '';

      // Display locations if any are returned
      if (data && data.elements && data.elements.length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
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
            Place id: ${location.id}<br>
            <a href="../location/coffeeShop/detail/${location.id}">See More</a>
          `;

          const ratingsCell = document.createElement('td');
          ratingsCell.style.border = '1px solid black';
          ratingsCell.setAttribute('data-location-id', location.id);


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
          // seeReviews.innerHTML = `<a href="/reviews/${location.id}">See Reviews</a>`;

          const coffeeReview = document.createElement('p');
          coffeeReview.style.marginTop = '10px';
          coffeeReview.innerHTML = `<a class="review" href="#">Been here? Write a review</a>`;

          // Append cells to the row
          coffeeDetailsCell.appendChild(coffeeReview);
          ratingsCell.appendChild(seeReviews);
          row.appendChild(coffeeDetailsCell);
          row.appendChild(ratingsCell);

          // add click functionality to the table:
          row.addEventListener('click', () => {
            // alert(`Row clicked for: ${location.tags.name || 'Unnamed Coffee Shop'}`);

            const locationId = location.id;
            const findMarker = window.coffee_markers.find(m => m.id === locationId);
            if (findMarker) {
              const marker = findMarker.marker;
              window.mapsterInstance.gMap.setCenter(marker.getPosition());
              window.mapsterInstance.gMap.setZoom(15);

              mapsterInstance._closeCurrentInfoWindow();

              if (!window.sharedInfoWindow) {
                window.sharedInfoWindow = new google.maps.InfoWindow();
              }
              window.sharedInfoWindow.setContent(`
                      <div>
                        <strong>${location.tags.name}</strong><br>
                        Address: ${location.tags['addr:street'] || "No address provided"}
                      </div>
                  `);

              window.sharedInfoWindow.open(window.mapsterInstance.gMap, marker);
              mapsterInstance.currentInfoWindow = window.sharedInfoWindow;
            }
          })

          // Append row to the table body
          tbody.appendChild(row);

          // seeReviews.querySelector('a').addEventListener('click', (event) => {
          //   event.preventDefault();
          //   showReviews(allReviews);
          // });

          coffeeReview.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            createReview(location.id, "coffee");
            updateReview(location.id, "coffee");
          });
        });

        table.appendChild(tbody);
        locationContainer.appendChild(table);
      } else {
        locationContainer.textContent = 'No coffee shops found.';
      }
    } catch (error) {
      // console.error('Error fetching coffee shops:', error);
      throw e;
    }
  } else {
    document.getElementById('coffeeLocations').innerHTML = '';
  }
});