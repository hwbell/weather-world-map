// need function to return an icon specifier, given the code from darksky
// icon options from the dark sky api:
// clear-day, clear-night, partly-cloudy-day, partly-cloudy-night, rain, snow, sleet, wind, fog, cloudy
// return the class of the font-awesome icon to be used

const weatherImagesList = {
  'clear-day': {
    icon: 'fas fa-sun',
  },
  'clear-night': {
    icon: 'fas fa-star-and-crescent'
  },
  'partly-cloudy-day': {
    icon: 'fas fa-cloud-sun'
  },
  'partly-cloudy-night': {
    icon: 'fas fa-cloud-moon'
  },
  'cloudy': {
    icon: 'fas fa-cloud'
  },
  'fog': {
    icon: 'fas fa-smog'
  },
  'rain': {
    icon: 'fas fa-cloud-rain'
  },
  'wind': {
    icon: 'fas fa-wind'
  },
  'sleet': {
    icon: 'fas fa-cloud-showers-heavy'
  },
  'snow': {
    icon: 'fas fa-snowflake'
  },

}

// this just indexes the icon list by id, returning the correct class
const getWeatherIcon = (iconId) => {
  return weatherImagesList[iconId].icon;
}

// this takes the weatherRecords, and the current lat / lng of the mouse and returns 
// a matchinf past record. This is for the popups
const getPastRecord = (weatherRecords, lat, lng) => {

  let pastRecord;
  weatherRecords.forEach((record, i) => {

    let lngsMatch = Math.abs(record.longitude - lng) < 1;
    let latsMatch = Math.abs(record.latitude - lat) < 1;

    if (latsMatch && lngsMatch) {
      pastRecord = record;
    }

  });

  return pastRecord;
}

module.exports = {
  weatherImagesList,
  getWeatherIcon,
  getPastRecord
}