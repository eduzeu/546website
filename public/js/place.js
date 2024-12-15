
const displayPlaceOfTheDay = async ()  => { 
  try{
    const response = await fetch("../home/");
    console.log(response);

    if(!response.ok){
      throw new Error("Failed to fetch place of the day.");
    }

    const place =  await response.json();
    
    console.log("place: ", place); 
    document.getElementById("place-name").textContent = place.name || "No place found";
    document.getElementById("place-address").textContent = place.address || "No place found";
    document.getElementById("place-type").textContent = place.type || "No place found";

  }catch(e){
    console.error(e);
    document.getElementById("placeHeading").textContent = "Place of The Day is not available";
    document.getElementById("place-name").textContent = "Error loading place.";
    document.getElementById("place-address").textContent = "Error loading address.";
    document.getElementById("place-type").textContent = "Error loading type.";
  }
};


displayPlaceOfTheDay();
