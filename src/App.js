import React, { Component } from 'react';

// styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Intro from './components/Intro';
import Weather from './components/Weather';

// tools
import mapboxgl from 'mapbox-gl';
import { weatherImageList, getWeatherIcon, getPastRecord } from './tools/weatherImages';

const openGeocoder = require('node-open-geocoder');
const fetch = require('node-fetch');

// initial state of the component. start @ denver, co. 
// this is just for positioning atm
const initialState = {
  weatherCoords: { lng: -104.991531, lat: 39.742243 },
  showWeather: false,
  location: 'Denver, CO',
  loadingWeather: false,
  weatherRecords: []
}

class App extends Component {

  constructor(props) {

    super(props)
    this.state = initialState;

    this.renderMap = this.renderMap.bind(this);
    this.fetchWeather = this.fetchWeather.bind(this);
    this.toggleShowWeather = this.toggleShowWeather.bind(this);
    this.registerClick = this.registerClick.bind(this);
    this.toggleView = this.registerClick.bind(this);
    this.showPopup = this.showPopup.bind(this);
  }

  componentDidMount() {
    // render the map once mounted
    this.renderMap();
  }

  // show public map with the publishing code from mapbox
  renderMap() {
    const self = this;

    let lng = this.state.weatherCoords.lng;
    let lat = this.state.weatherCoords.lat;

    mapboxgl.accessToken = 'pk.eyJ1IjoiaHdiZWxsIiwiYSI6ImNqdXU4OXY2YjA4cWU0NGxsZzFlYWdobmwifQ.nnjWcSrzbW4o3oq-QYOXhg';
    var map = new mapboxgl.Map({
      container: 'map',
      center: [lng, lat],
      zoom: 5,
      style: 'mapbox://styles/hwbell/cjuvfzqlt4h141fomxbjysorm',
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.on('mousemove', function (e) {
      // save the state of the mouse in lat, lng (coords) and  x,y (points) 
      self.setState({
        coords: e.lngLat,
        point: e.point
      });

    })

    // handle the user clicking the map
    map.on('click', function (e) {
      console.log(e)
      // get the weather
      self.registerClick(e);

      var geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: {
                lng: e.lngLat.lng,
                lat: e.lngLat.lat
              },
              point: e.point
            },
            properties: {
              title: 'Mapbox',
              description: 'Washington, D.C.'
            }
          },
        ]
      };

      // add markers to map
      geojson.features.forEach(function (marker) {

        // create a HTML element for each feature
        var el = document.createElement('i');
        el.className = 'marker fas fa-map-marker-alt';
        el.onmouseover = () => {
          let point = marker.geometry.point;
          let coords = marker.geometry.coordinates;
          self.showPopup(point, coords);
        }
        el.onmouseleave = () => {
          self.hidePopup();
        }
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          // attach popup
          .addTo(map);
      });

    });

    this.setState({ map });
  }

  // switch between map and satellite
  toggleView() {
    let satellite = 'mapbox://styles/mapbox/satellite-v9';
    let map = 'mapbox://styles/hwbell/cjuvfzqlt4h141fomxbjysorm';
    let newMap = JSON.parse(JSON.stringify(this.state.map));

    if (this.state.map.style === map) {
      newMap.setStyle(satellite);
    } else {
      newMap.setStyle(map);
    }

    this.setState({
      map: newMap
    })

  }

  // get the weather json to be passed to the Weather component from our node backend,
  // which will actually make the request to darksky
  fetchWeather() {
    const self = this;

    let lat = this.state.coords.lat;
    let lng = this.state.coords.lng;

    fetch(`https://hb-weather-server.herokuapp.com/weather/${lat}/${lng}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);

        // get the current weather records and add this one. this can be used to find weather
        // info for popups, so you dont have to re-fetch. 
        let newWeatherRecords = this.state.weatherRecords.slice();

        // save the location too
        res.fineLocation = this.state.location;
        newWeatherRecords.push(res);

        self.setState({
          weatherRecords: newWeatherRecords,
          weatherData: res,
          showWeather: true // show the data once we have it
        });

      })
      .catch((err) => {
        console.log(err)
      });
  }

  registerClick(e) {
    // use node-open-geocoder to get location info
    openGeocoder()
      .reverse(e.lngLat.lng, e.lngLat.lat)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return this.setState({
            location: `Couldn't find address info ... click again?`
          });
        }
        // console.log(res)

        if (res.address) {
          // the address object includes different info for different places,
          // so need to make it flexible
          let { city, town, county, state, country } = res.address;

          // filter out the ones that don't exist
          let displayInfo = [city, town, county, state, country].filter(item => !!item)

          let location = displayInfo.join(', ');

          // update state 
          this.setState({
            location,
            weatherCoords: e.lngLat,
          }, () => {
            this.fetchWeather();
          });
        }
        else {
          // if can't get any info, just show lat / long. this happens in open ocean,
          // for example
          let lat = Math.round(e.lngLat.lat * 100) / 100;
          let lng = Math.round(e.lngLat.lng * 100) / 100;

          let location = `Latitude: ${lat}, Longitude: ${lng}`;

          // update state 
          this.setState({
            location,
            weatherCoords: e.lngLat,
          }, () => {
            this.fetchWeather();
          });
        }

      })


  }

  // this is to show the popup over map markers for previously clicked points
  showPopup() {
    let { x, y } = this.state.point;
    let { lat, lng } = this.state.coords;

    this.setState({
      popupCoords: {
        lat, lng, x, y
      }
    });
  }

  hidePopup() {
    this.setState({
      popupCoords: null,
    });
  }

  renderPopup() {
    let { lat, lng, x, y } = this.state.popupCoords;

    // get the weather info from the matching record in this.state.weatherRecords
    let pastRecord = getPastRecord(this.state.weatherRecords, lat, lng);
    // console.log('pastRecord');
    // console.log(pastRecord);
    // console.log(this.state.weatherRecords);

    let divStyle = {
      height: '150px',
      width: '150px',
      position: 'absolute',
      top: y + 15,
      left: x - 30,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
    let pStyle = {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 500
    }

    return (
      <div style={divStyle}>
        {!pastRecord ?
          <p>{`Lat: ${Math.floor(lat)}, Long: ${Math.floor(lng)}`}</p>
          :
          <div>
            <p style={pStyle}>{`${pastRecord.fineLocation}`}</p>
            <p style={pStyle}>{`${Math.floor(pastRecord.currently.temperature)}`}&deg;F</p>
            <p style={pStyle}>
              <i className={getWeatherIcon(pastRecord.currently.icon)}></i>
            </p>
          </div>
        }
      </div>
    )
  }

  // this is called from within the Weather component, to close the 
  // weather window
  toggleShowWeather() {
    this.setState({
      showWeather: false
    })
  }

  // 
  render() {

    return (
      <div style={styles.container}>

        {/* the map itself */}
        <div id='map' style={{ width: '100vw', height: '100vh' }}>

          {/* the upper left text */}
          {<Intro coords={this.state.coords} />}

          {this.state.popupCoords && this.state.weatherRecords ?
            this.renderPopup()
            : null
          }

        </div>
        <div>
          {/* shows when the user clicks on the map */}
          {this.state.showWeather &&
            <Weather
              location={this.state.location}
              weatherData={this.state.weatherData}
              coords={this.state.weatherCoords}
              showWeather={this.state.showWeather}
              close={this.toggleShowWeather}
            />}
        </div>

      </div>
    );
  }
}

const styles = {
  container: {
    // margin: '3vw 3vh'
  },

}

export default App;
