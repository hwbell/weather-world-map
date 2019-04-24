import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import mapboxgl from 'mapbox-gl';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 
    }
    this.renderMap = this.renderMap.bind(this);
  }

  componentDidMount() {
    this.renderMap()
  }

  renderMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaHdiZWxsIiwiYSI6ImNqdXU4OXY2YjA4cWU0NGxsZzFlYWdobmwifQ.nnjWcSrzbW4o3oq-QYOXhg';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9'
    });
  }

  render() {
    return (
      <div id='map' style={{width: '1500px', height: '1000px'}}></div>
    );
  }
}

export default App;
