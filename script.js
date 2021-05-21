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
const getWeather = async (location) => {
  const API_KEY = "712f1bdf3705276004500faca1f99168";

  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data) {
      return;
    }

    const locationName = data.name;
    const country = data.sys.country;
    const shortDesc = data.weather[0].main;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconurl = `http://openweathermap.org/img/w/${icon}.png`;
    const windSpeed = data.wind.speed;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;

    return {
      locationName,
      country,
      shortDesc,
      description,
      iconurl,
      windSpeed,
      temperature,
      humidity,
    };
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
const convertTemp = (e) => {
  const initTemp = e.parentNode.previousElementSibling.querySelector(".temp");
  // split number from unit with regex
  const tempDetails = initTemp.innerHTML.match(/([\d\.]+)(.*)/);
  const tempNum = tempDetails[1];
  const tempUnit = tempDetails[2];
  if (tempUnit === "℃") {
    const fahrenheit = ((Number(tempNum) * 9) / 5 + 32).toFixed(2);
    initTemp.innerHTML = `${fahrenheit}&#8457;`;
  } else {
    // (24.42°F − 32) × 5/9
    const celsius = (((Number(tempNum) - 32) * 5) / 9).toFixed(2);
    initTemp.innerHTML = `${celsius}&#8451;`;
  }
};
const renderMap = async (e) => {
  e.preventDefault();
  const searchAddress = document.getElementById("search").value;
  const locationInfo = await getLocation(searchAddress);

  if (!locationInfo) return;

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: locationInfo.location,
  });
  // GET WEATHER INFO AND ADD TO CONTENT STRING

  const weatherInfo = await getWeather(locationInfo.location);

  const contentString = weatherInfo
    ? `
       <div class="weather">
       <div class="content">
           <div class="icon">
               <img src=${weatherInfo.iconurl} alt="weather icon">
           </div>
           <div class="desc">
               <p class="desc-location"><span class="location">${weatherInfo.locationName}, ${weatherInfo.country},</span> ${weatherInfo.description}</p>
               <p class="desc-details"><span class="temp">${weatherInfo.temperature}&#8451;</span>, wind ${weatherInfo.windSpeed} m/s. ${weatherInfo.shortDesc} ${weatherInfo.humidity} %</p>
           </div>
       </div>
       <div class="actions">
       <button class="convert" id="convert" onclick="convertTemp(this)">Convert temperature</button>
       <button class="share" id="share" >
       <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.google.com/maps/search/?api=1&query=${encodeURI(
         locationInfo.formattedAddress
       )}" target="_blank" rel="noopener" class="share">
       <i class="fab fa-facebook-f"></i> Share
       </a>
   </button>
       </div>     
       </div>
       `
    : `
       <div class="error">
               <p class="error-msg">
                   Oops! Could not get weather for this location!
               </p>
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
