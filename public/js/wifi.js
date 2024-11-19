document.getElementById('wifiCheckbox').addEventListener('change', async function () {
  if (this.checked) {
    try {
      const response = await fetch('/wifi-locations');
      const data = await response.json();

      const locationContainer = document.getElementById('wifiLocations');
      locationContainer.innerHTML = ''; // Clear previous locations

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
            Longitude: ${location.Longitude}
          `;
          // Second cell: Ratings and reviews
          const ratingsCell = document.createElement('td');
          ratingsCell.style.border = '1px solid black';
          ratingsCell.innerHTML = `
            <strong>Rating:</strong> ${location.Rating || 'Not rated yet'}<br>
            <strong>Reviews:</strong> ${location.Reviews || 'No reviews yet'}
          `;

          const wifiReview = document.createElement('p');
          wifiReview.style.marginTop = '10px';
          wifiReview.innerHTML = `<a href="#">Been here? Write a review</a>`;

          // Append cells to the row
          wifiDetailsCell.appendChild(wifiReview);
          row.appendChild(wifiDetailsCell);
          row.appendChild(ratingsCell);
          //row.appendChild(wifiReview);

          // Append row to the table body
          tbody.appendChild(row);

          wifiDetailsCell.addEventListener('click', () => {
            createReview();
          })
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
    // Clear locations if checkbox is unchecked
    document.getElementById('wifiLocations').innerHTML = '';
  }
});

const createReview = () => {
  const structure = document.createElement('diV');
  structure.style.top = '50%';
  structure.style.position = 'fixed';
  structure.style.left = '50%';
  structure.style.transform = 'translate(-50%, -50%)';
  structure.style.backgroundColor = '#fff';
  structure.style.padding = '20px';
  structure.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  structure.style.zIndex = '1000';
  structure.style.borderRadius = '10px';
  structure.style.width = '300px';
  structure.style.textAlign = 'center';

  structure.innerHTML = `
      <textarea rows="4" cols="30" placeholder="Enter your review here"></textarea><br><br>
      <button button id="submitReviewButton">Submit</button>
      <button id="closeButton">Close</button>
        `;
  
  document.body.appendChild(structure);

  document.getElementById('closeButton').addEventListener('click', () =>{
    document.body.removeChild(structure);
  });

  // document.getElementById('submitReviewButton').addEventListener('click', () =>{
  //   const text = structure.querySelector('textarea').value;
  //   if
  // })
};