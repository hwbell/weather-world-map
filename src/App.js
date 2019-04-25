import React, { Component } from 'react';

// styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Intro from './components/Intro';
import Weather from './components/Weather';

// tools
import mapboxgl from 'mapbox-gl';
const fetch = require('node-fetch');

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showWeather: false 
    }
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
      showWeather: !this.state.showWeather
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
      .then( res => res.json() )
      .then( res => {
        console.log(res);
        self.setState({
          weatherData: res,
          showWeather: true
        });
        
      })
  }

  // show public map
  renderMap() {
    const self = this;

    mapboxgl.accessToken = 'pk.eyJ1IjoiaHdiZWxsIiwiYSI6ImNqdXU4OXY2YjA4cWU0NGxsZzFlYWdobmwifQ.nnjWcSrzbW4o3oq-QYOXhg';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
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
      <div id='map' style={{ width: '1100px', height: '800px' }}>

        {/* shows after 2000ms */}
        { this.state.coords && <Intro />}

        {/* shows when the user clicks on the map */}
        { this.state.showWeather && 
        <Weather 
          weather={this.state.weatherData}
          coords={this.state.weatherCoords}
          showWeather={this.state.showWeather}
          toggle={this.toggleShowWeather}
        /> }

      </div>
    );
  }
}

export default App;
