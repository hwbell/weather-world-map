import React, { Component } from 'react';

// styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Intro from './components/Intro';
import Weather from './components/Weather';

// tools
import mapboxgl from 'mapbox-gl';


const openGeocoder = require('node-open-geocoder');
const fetch = require('node-fetch');

// initial state of the component. start @ denver, co. 
// this is just for positioning atm
const initialState = {
  weatherCoords: { lng: -104.991531, lat: 39.742243 },
  showWeather: false,
  location: 'Denver, CO'
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
        points: e.point
      });

    })

    // handle the user clicking the map
    map.on('click', function (e) {
      self.registerClick(e);
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

    let lat = this.state.weatherCoords.lat;
    let lng = this.state.weatherCoords.lng;

    fetch(`https://hb-weather-server.herokuapp.com/weather/${lat}/${lng}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        self.setState({
          weatherData: res,
          showWeather: true // show the data once we have it
        });

      })
      .catch((err) => {
        console.log(err)
      });
  }

  // this is called from within the Weather component, to close the 
  // weather window
  toggleShowWeather() {
    this.setState({
      showWeather: false
    })
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

          this.setState({
            location
          });
        }
        else {
          // if can't get any info, just show lat / long. this happens in open ocean,
          // for example
          let lat = Math.round(e.lngLat.lat * 100) / 100;
          let lng = Math.round(e.lngLat.lng * 100) / 100;

          let location = `Latitude: ${lat}, Longitude: ${lng}`;
          this.setState({
            location
          });
        }

      })

    // update state 
    this.setState({
      weatherCoords: e.lngLat,
      points: e.point
    }, () => {
      this.fetchWeather();
    });
  }

  // 
  render() {

    return (
      <div style={styles.container}>

        {/* the map itself */}
        <div id='map' style={{ width: '100vw', height: '100vh' }}>

          {/* the upper left text - shows after 2000ms */}
          {this.state.coords && <Intro coords={this.state.coords} />}

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
  }
}

export default App;
