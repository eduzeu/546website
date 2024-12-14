
document.getElementById('wifi-checkbox').addEventListener('change', async function () {
  if (this.checked) {
    try {
      document.getElementById('coffeeLocations').innerHTML = '';
      const data = await fetchFrom('../location/wifi');
      const revData = await fetchFrom('../review/wifi');

      const locationContainer = document.getElementById('wifiLocations');
      locationContainer.innerHTML = '';

      // Display locations if any are returned
      if (Object.keys(data).length > 0) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr>
            <th style="border: 1px solid black; padding: 20px;">Wi-Fi Location</th>
            <th style="border: 1px solid black; padding: 20px;">Ratings & Reviews</th>
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
          ratingsCell.setAttribute('data-location-id', location.place_id);

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

const displayPlaceOfTheDay = async () => {
  try {
    let store = JSON.parse(localStorage.getItem("placeOfTheDay"));
    let storeTime = localStorage.getItem("nextUpdateTime");
    const time = Date.now();

    storeTime = parseInt(storeTime, 10);

    if (!store || !storeTime || time >= storeTime) {
      const placeInfo = await fetchFrom('../location/wifi/place');
      console.log(placeInfo);

      localStorage.setItem('placeOfTheDay', JSON.stringify(placeInfo));
      localStorage.setItem('nextUpdateTime', (time + 24 * 60 * 60 * 1000).toString());

      store = placeInfo;
    }

    document.getElementById('place-name').textContent = store.Neighborhood || "No name available";
    document.getElementById('place-address').textContent = store.Place || "No address available";
    document.getElementById('place-type').textContent = "Wifi";

  } catch (e) {
    console.error('Error displaying place of the day:', e);
  }
}

// Attach the function to window load
window.onload = displayPlaceOfTheDay;