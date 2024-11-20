
document.getElementById('wifiCheckbox').addEventListener('change', async function () {
  if (this.checked) {
    try {
      const response = await fetch('/wifi-locations');
      const data = await response.json();
      //console.log(response)
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

          wifiReview.querySelector('a').addEventListener('click', () => {
            event.preventDefault();
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
    document.getElementById('wifiLocations').innerHTML = '';
  }
});


const callReview = async (score, text) => {

  const numericScore = Number(score);
  try {
    const response = await fetch('/wifi-review', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',   
      },
      body: JSON.stringify({ rating: numericScore , text: text }),  
    });

   
  } catch (error) {
    console.error('Error calling review API:', error);
    throw new Error('Failed to submit the review');  // Throw a custom error for frontend handling
  }
};

const createReview = () => {
  const structure = document.createElement('div');
  structure.style.top = '50%';
  structure.style.position = 'fixed';
  structure.style.left = '50%';
  structure.style.transform = 'translate(-50%, -50%)';
  structure.style.backgroundColor = '#EFEBCE';
  structure.style.padding = '20px';
  structure.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  structure.style.borderRadius = '10px';
  structure.style.width = '300px';
  structure.style.textAlign = 'center';

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

    // Log values for debugging
    console.log('Submitting review:', { score, text });
    console.log(typeof score);

    try {
      // Call the backend API to submit the review
      await callReview(score, text);
      alert('Review submitted successfully!');
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
