// Function to check location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Browser not supported. Please use another browser or device.");
  }
}
// Display location in an alert
function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  // Create a Google Maps link with the coordinates
  var gmapsLink = "https://www.google.com/maps?q=" + latitude + "," + longitude;
  // Open the link in a new tab
  // window.open(gmapsLink, "_blank");
  console.log(latitude, longitude, gmapsLink);
  
  // Call the function to get the address using Nominatim
  getAddress(latitude, longitude);
}

// Function to get the address from coordinates using Nominatim (OpenStreetMap)
function getAddress(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const address = data.display_name; // Get the address from the response
      document.getElementById("address").innerHTML = `Address: ${address}`;
    })
    .catch(error => {
      document.getElementById("address").innerHTML = "Error retrieving data.";
      console.error("Error: ", error);
    });
}

// Display error message if failed
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Allow location access to prepare the best price data for you.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Price list for your location is unavailable.");
      break;
    case error.TIMEOUT:
      alert("An error occurred, please refresh the page and try again.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred, please refresh the page and try again.");
      break;
  }
}
// Function to check battery status
function getBatteryStatus() {
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      updateBatteryStatus(battery);
      // Update when battery status changes
      battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
      battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
      battery.addEventListener('dischargingtimechange', () => updateBatteryStatus(battery));
      battery.addEventListener('chargingtimechange', () => updateBatteryStatus(battery));
    }).catch(error => {
      document.getElementById('batteryStatus').innerHTML = "Failed to get battery status.";
      console.error("Error: ", error);
    });
  } else {
    document.getElementById('batteryStatus').innerHTML = "Battery API not supported by this browser.";
  }
}
// Function to update battery status
function updateBatteryStatus(battery) {
  let batteryStatus = document.getElementById('batteryStatus');
  let chargingStatus = battery.charging ? "Charging" : "Not Charging";
  let dischargingTime = battery.dischargingTime === Infinity ? "Unknown" : `${Math.round(battery.dischargingTime / 60)} minutes`;
  let chargingTime = battery.chargingTime === Infinity ? "Unknown" : `${Math.round(battery.chargingTime / 60)} minutes`;
  batteryStatus.innerHTML = `
    <br>
    Battery Charge Percentage: ${Math.round(battery.level * 100)}% 
    <br>
    Charging Status: ${chargingStatus} 
    <br>
    Time till fully discharged: ${dischargingTime} 
    <br>
    Time till fully charged: ${chargingTime}
  `;
}