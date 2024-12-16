
document.getElementById('wifi-checkbox').addEventListener('change', async function () {
  const mapsterInstance = window.mapsterInstance;
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

          // adding marker 
          const marker = mapsterInstance.addMarker({
            lat: parseFloat(location.Latitude),
            lng: parseFloat(location.Longitude),
            title: location['Wifi name'] || "Unnamed Wifi Location",
            icon: {
              url: 'https://i.imgur.com/pDk8HOg.png',
              scaledSize: new google.maps.Size(28, 34),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(16, 32)
            },
            content: `
                <div>
                    <strong>${location['Wifi name'] || "Unnamed Wifi Location"}</strong><br>
                    Place: ${location.Place || "No place provided"}<br>
                    Neighborhood: ${location.Neighborhood || "No neighborhood provided"}<br>
                </div>
            `
          });
          window.wifi_markers.push({ id: location.place_id, marker });


          row.addEventListener('click', () => {
            mapsterInstance.gMap.setCenter(marker.getPosition());
            mapsterInstance.gMap.setZoom(15);

            mapsterInstance._closeCurrentInfoWindow();

            if (!window.sharedInfoWindow) {
              window.sharedInfoWindow = new google.maps.InfoWindow();
            }

            window.sharedInfoWindow.setContent(`
              <div>
                  <strong>${location['Wifi name']}</strong><br>
                  Place: ${location.Place || "No place provided"}<br>
                  Neighborhood: ${location.Neighborhood || "No neighborhood provided"}
              </div>
          `);

            window.sharedInfoWindow.open(mapsterInstance.gMap, marker);
            mapsterInstance.currentInfoWindow = window.sharedInfoWindow;
          });

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
    wifi_markers.forEach(item => {
      mapsterInstance._removeMarker(item.marker);
    });
    wifi_markers.length = 0;
    document.getElementById('wifiLocations').innerHTML = '';
    document.getElementById('wifiLocations').innerHTML = '';
  }
});
