document.getElementById('wifiCheckbox').addEventListener('change', async function() {
  if (this.checked) {
    try {
      const response = await fetch('/wifi-locations');
      const data = await response.json();

      const locationContainer = document.getElementById('wifiLocations');
      locationContainer.innerHTML = ''; // Clear previous locations

      // Display locations if any are returned
      if (Object.keys(data).length > 0) {
        const ul = document.createElement('ul');
        Object.values(data).forEach(location => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${location['Wifi name']}</strong><br>Place: ${location.Place}<br>Neighborhood: ${location.Neighborhood}<br>Latitude: ${location.Latitude},<br>Longitude: ${location.Longitude}`;
          ul.appendChild(li);
        });
        locationContainer.appendChild(ul);
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
