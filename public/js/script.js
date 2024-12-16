
// this works and is in ES6 syntax
(async (window, mapster) => {
    // map options
    const wifi_url = '/location/wifi';
    const coffee_url = '/location/coffeeShop';

    const options = mapster.MAP_OPTIONS;
    const element = document.getElementById('map-canvas');

    // map
    const map = mapster.create(element, options);
    // make the map global
    window.mapsterInstance = map;


    const initialLatLng = { 'lat': null, 'lng': null };

    const nycBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(40.477399, -74.259090),
        new google.maps.LatLng(40.917577, -73.700272)
    );

    function initialize() {
        let input = document.getElementById('searchTextField');
        let search_bar = new google.maps.places.Autocomplete(input, {
            bounds: nycBounds,
            strictBounds: true,
            types: ['address'],
            componentRestrictions: { country: 'us' }
        });
        search_bar.setComponentRestrictions({
            country: ['us'],
            administrativeArea: 'New York City'
        });
        // search_bar.bindTo("bounds", map);

        const position_marker = map.addMarker({
            anchorPoint: new google.maps.Point(0, -29),
            visible: false,
            icon: {
                // url: 'https://i.imgur.com/xgIzHcA.png',
                url: 'https://cdn-icons-png.flaticon.com/512/1783/1783356.png',
                scaledSize: new google.maps.Size(30, 30), // Scaled size (width, height in pixels)
                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
            }
        });


        search_bar.addListener("place_changed", () => {
            const place = search_bar.getPlace();

            if (!place.geometry || !nycBounds.contains(place.geometry.location)) {
                alert('Please select an address within New York City.');
                input.value = '';
                return;
            }
            const addressComponents = place.address_components;
            const isInNYC = addressComponents.some(component =>
                component.long_name === 'New York' &&
                (component.types.includes('locality') || component.types.includes('administrative_area_level_1'))
            );

            if (!isInNYC) {
                alert('Please select an address within New York City.');
                input.value = '';
                return;
            }

            console.log(`The place gotten is: `);
            console.log(place);

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            initialLatLng['lat'] = lat;
            initialLatLng['lng'] = lng;
            console.log(`lat: ${lat}, lng: ${lng}.`);

            map.gMap.setCenter({ lat: lat, lng: lng });
            map.gMap.setZoom(15);
            if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
                position_marker.setPosition({ lat, lng });
                position_marker.setVisible(true);
            } else {
                console.error("Invalid coordinates for position:", { lat, lng });
                alert("Error: Invalid coordinates. Please try again.");
            }
            position_marker.setPosition({ lat: lat, lng: lng });
            position_marker.setVisible(true);
        });
    }

    // google.maps.event.addDomListener(window, 'load', initialize); // deprecated
    window.addEventListener('load', initialize);
    let currCircle = null;

    window.radiusSubmit = function () {
        if (initialLatLng['lat'] === null || initialLatLng['lng'] === null) {
            console.log('Please enter an address first.');
            alert('Please enter an address first.');
            return;
        }
        const selectedRadius = document.getElementById('radius');
        const radiusValue = selectedRadius.value;
        console.log('Radius selected:', radiusValue + ' miles');

        if (currCircle) {
            currCircle.setMap(null);
        }

        currCircle = new google.maps.Circle({
            strokeColor: "#A3A380",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#A3A380",
            fillOpacity: 0.35,
            map: map.gMap,
            center: { lat: initialLatLng['lat'], lng: initialLatLng['lng'] },
            // radius is in meters apparently so multiply the miles by 1609.34
            radius: radiusValue * 1609.34,
        });

        const circleBounds = currCircle.getBounds();
        window.mapsterInstance.gMap.fitBounds(circleBounds);
    }

    // globally accessible
    window.coffee_markers = [];
    window.wifi_markers = []; 


    document.getElementById('wifi-checkbox').addEventListener('change', async function () {
        if (this.checked) {
            coffee_markers.forEach(item => {
                map._removeMarker(item.marker); 
            });
            coffee_markers = [];
            try {
                console.log("Fetching WiFi data...");
                const data = await fetchFrom(wifi_url);
                console.log("WiFi data fetched successfully:", data);

                const wifi_entries = Object.values(data);

                wifi_entries.forEach(entry => {
                    if (entry.Latitude && entry.Longitude) {
                        let marker = map.addMarker({
                            lat: parseFloat(entry.Latitude),
                            lng: parseFloat(entry.Longitude),
                            title: entry['Wifi name'] || "Unnamed Location",
                            icon: {
                                // url: 'https://i.imgur.com/xgIzHcA.png',
                                url: 'https://i.imgur.com/pDk8HOg.png',
                                scaledSize: new google.maps.Size(28, 34), // Scaled size (width, height in pixels)
                                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
                            },
                            // content: `Name: ${entry['Wifi name']}, Place: ${entry.Place}, Neighborhood: ${entry.Neighborhood}` // ADD THE NECESSARY THINGS HERE
                            content:
                                `<div>
                                <strong>Name:</strong> ${entry['Wifi name'] || "Unnamed Wifi Location"}<br>
                                <strong>Place:</strong> ${entry.Place || "No place provided"}<br>
                                <strong>Neighborhood:</strong> ${entry.Neighborhood || "No neighborhood provided"}<br>
                            </div>`
                        });
                        // wifi_markers.push(marker);
                        wifi_markers.push({ id: entry.place_id, marker });
                    } else {
                        console.warn("Missing coordinates for entry:", entry);
                    }
                });
            }
            catch (error) {
                console.error("Error fetching WiFi locations:", error);
            }
        }
        else {
            wifi_markers.forEach(item => {
                map._removeMarker(item.marker);
            });
            wifi_markers = [];
        }
    });
    document.getElementById('coffee-checkbox').addEventListener('change', async function () {
        if (this.checked) {
            wifi_markers.forEach(item => {
                map._removeMarker(item.marker);
            });
            wifi_markers = [];
            try {
                console.log("Fetching Coffee Shop data...");
                const data = await fetchFrom(coffee_url);
                console.log("Coffee Shop data fetched successfully:", data);

                data.elements.forEach(entry => {
                    if (entry.lat && entry.lon) {
                        let marker = map.addMarker({
                            lat: parseFloat(entry.lat),
                            lng: parseFloat(entry.lon),
                            title: entry.tags.name || "Unnamed Coffee Shop",
                            icon: {
                                // url: 'https://i.imgur.com/Q0lGgUU.png',
                                url: 'https://i.imgur.com/CU43Ymm.png',
                                scaledSize: new google.maps.Size(28, 34), // Scaled size (width, height in pixels)
                                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
                            },
                            content:
                                `<div>
                                <strong>Name:</strong> ${entry.tags.name || "Unnamed Coffee Shop"}<br>
                                <strong>Address:</strong> ${entry.tags["addr:street"] || "No address provided"}<br>
                                <a href="/location/coffeeShop/detail/${entry.id}" target="_blank">View Details</a>
                            </div>`
                            // content: `Name: ${entry.tags.name}, Address: ${entry.tags["addr:street"] || "No address provided"}` // ADD THE NECESSARY THINGS HERE
                        });
                        // coffee_markers.push(marker);
                        coffee_markers.push({ id: entry.id, marker });
                    } else {
                        console.warn("Missing coordinates for entry:", entry);
                    }
                });
            } catch (error) {
                console.error("Error fetching Coffee Shop locations:", error);
            }
        }
        else {
            coffee_markers.forEach(item => {
                map._removeMarker(item.marker); 
            });
            coffee_markers = [];
        }
        
    });

})(window, window.Mapster);
