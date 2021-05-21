const API_KEY = "AIzaSyDXMipmXaHFg8t9o7kiam9dL6nM0RX36HI";
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

// Initiates static map
function initMap() {
  const center = { lat: 9.0556, lng: 7.4914 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center,
  });
}

const renderMap = async (e) => {
  e.preventDefault();
  const searchAddress = document.getElementById("search").value;
  const locationInfo = await getLocation(searchAddress);

  if (!locationInfo) return;

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: locationInfo.location,
  });

  const contentString = `
        <div>
            This is a weather info container
        </div>
        `;

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  const marker = new google.maps.Marker({
    position: locationInfo.location,
    map,
    title: `Click to get weather information`,
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
};

// Event listeners

form.addEventListener("submit", renderMap);