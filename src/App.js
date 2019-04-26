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

// initial state of the component. start @ denver, co
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
  }

  componentDidMount() {
    this.renderMap();
  }


  // this is called both rom within the Weather component, to close the 
  // weather window
  toggleShowWeather() {
    this.setState({
      showWeather: false
    })
  }

  // get the weather json to be passed to the Weather component
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
          showWeather: true
        });

      })
      .catch(err => {console.log(err)});
  }

  // show public map
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

    map.on('mousemove', function (e) {

      // save the state of the mouse in lat, lng (coords) and  x,y (points) 
      self.setState({
        coords: e.lngLat,
        points: e.point
      });

    })

    // handle the user clicking the map
    map.on('click', function (e) {

      openGeocoder()
        .reverse(e.lngLat.lng, e.lngLat.lat)
        .end((err, res) => {
          if (err) {
            console.log(err);
            return self.setState({
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

            self.setState({
              location
            });
          }
          else {
            // if can't get any info, just show lat / long. this happens in open ocean,
            // for example
            let lat = Math.round(e.lngLat.lat * 100) / 100;
            let lng = Math.round(e.lngLat.lng * 100) / 100;

            self.setState({
              location: `Latitude: ${lat}, Longitude: ${lng}`
            });
          }

        })

      // update state 
      self.setState({
        weatherCoords: e.lngLat,
        points: e.point
      }, () => {
        self.fetchWeather();
      });
    });
  }

  render() {
    return (
      <div style={styles.container}>

        <div id='map' style={{ width: '100vw', height: '100vh' }}>

          {/* shows after 2000ms */}
          {this.state.coords && <Intro />}

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
