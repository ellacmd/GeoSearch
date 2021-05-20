const API_KEY = "AIzaSyDNNTpLE8zgFxtdCGGT9FmuX1ii_macfak";
const form = document.getElementById("form");
const error = document.getElementById("error");

const getLocation = async (address) => {
  try {
    // Request to get location coords and full address
    const encodedAddress = encodeURI(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Error handling if address not found
    if (!data.results.length) {
      error.classList.add("show-error");
      return;
    }

    error.classList.remove("show-error");
    const formattedAddress = data.results[0].formatted_address;
    const location = data.results[0].geometry.location;
    return { formattedAddress, location };
  } catch (error) {
    console.log(error);
  }
};

const renderMap = async (e) => {
  e.preventDefault();
  const searchAddress = document.getElementById("search").value;
  const locationInfo = await getLocation(searchAddress);

  console.log(locationInfo);
};

// Event listeners

form.addEventListener("submit", renderMap);