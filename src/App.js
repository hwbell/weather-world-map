import React, { Component } from 'react';

// styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Intro from './components/Intro';

// tools
import mapboxgl from 'mapbox-gl';
const fetch = require('node-fetch');

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // 
    }
    this.renderMap = this.renderMap.bind(this);
    this.fetchWeather = this.fetchWeather.bind(this);
  }

  componentDidMount() {
    this.renderMap();
  }

  // get the weather json to be passed to the Weather component
  fetchWeather() {
    
    let lat = this.state.weatherCoords.lat;
    let lng = this.state.weatherCoords.lng;

    fetch(`https://hb-weather-server.herokuapp.com/weather/${lat}/${lng}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      }
    })
      .then( res => res.json() )
      .then( res => console.log(res))
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
      <div id='map' style={{ width: '1500px', height: '1000px' }}>

        {/* shows after 2000ms */}
        { this.state.coords && <Intro coords={this.state.coords} />}

        {/* shows when the user clicks on the map */}


        {/* show lat / lng */}


      </div>
    );
  }
}

export default App;
