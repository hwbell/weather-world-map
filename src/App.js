import React, { Component } from 'react';

// styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Intro from './components/Intro';
import Weather from './components/Weather';
import Loader from 'react-loader-spinner'

// tools
import windowSize from 'react-window-size';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { getWeatherIcon } from './tools/weatherImages';

// pose animation
import posed, { PoseGroup } from 'react-pose';
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const openGeocoder = require('node-open-geocoder');
const fetch = require('node-fetch');

// initial state of the component. start @ denver, co. 
// this is just for positioning atm
const initialState = {
  weatherCoords: { lng: -104.991531, lat: 39.742243 },
  showWeather: false,
  showLoading: false,
  location: 'Denver, CO',
  loadingWeather: false,
  weatherRecords: [],
  popups: [],
  pointerHovering: false,
  enableMapClick: true
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
    this.renderPopup = this.renderPopup.bind(this);
  }

  componentDidMount() {
    // render the map once mounted
    this.renderMap();
    this.setState({
      enableMapClick: true
    })
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

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'bottom-left');
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },

      trackUserLocation: true,
      // style: {
      //   margin: '20px'
      // }
    }), 'bottom-left');
    map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));

    map.on('mousemove', function (e) {
      // save the state of the mouse in lat, lng (coords) and  x,y (points) 
      self.setState({
        coords: e.lngLat,
        point: e.point
      });

    })

    // handle the user clicking the map
    map.on('click', function (e) {

      // use the pointerHovering and mapEnabled booleans to determine wether or not to short
      // circuit the map click. 
      // enableMapClick is turned off during weather fetches so the user can't click like crazy and
      // break the app
      if (self.state.pointerHovering || !self.state.enableMapClick) {
        return;
      }

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
            }
          }
        ]
      };

      // add marker to map
      geojson.features.forEach(function (marker) {

        // create a HTML element for each feature
        var el = document.createElement('i');
        el.className = 'marker fas fa-map-marker-alt';
        el.onmouseover = () => {
          // let point = marker.geometry.point;
          // let coords = marker.geometry.coordinates;
          self.setState({
            marker,
            pointerHovering: true
          }, () => {
            self.renderPopup();
          })

        }
        el.onmouseleave = () => {
          self.hidePopup();
          self.setState({
            pointerHovering: false
          })
        }
        el.onclick = () => {
          // console.log("clicked on pointer")

          // short circuit if there aren't any records yet
          if (!self.state.weatherRecords.length) {
            return;
          }

          // e.preventDefault();
          let { lat, lng } = marker.geometry.coordinates;

          let pastRecord = self.state.weatherRecords.find((el) => {
            // console.log(el.lng, lng, el.lat,  lat)
            return el.longitude === lng && el.latitude === lat
          })
          self.setState({
            weatherData: pastRecord,
            showWeather: true,
          })
          // console.log(pastRecord)
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

  registerClick(e) {

    // turn the map off so we don't have multiple fetches from rapid clicking
    this.setState({
      enableMapClick: false
    })

    // console.log("clicked on map")
    let { lng, lat } = e.lngLat;

    this.setState({
      clickedCoords: {
        lng, lat
      },
      showLoading: true
    });
    // use node-open-geocoder to get location info
    openGeocoder()
      .reverse(lng, lat)
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


  // get the weather json to be passed to the Weather component from our node backend,
  // which will actually make the request to darksky
  fetchWeather() {
    const self = this;

    let lat = this.state.clickedCoords.lat;
    let lng = this.state.clickedCoords.lng;

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
        res.coordinates = {
          lat, lng
        };

        newWeatherRecords.push(res);

        self.setState({
          weatherRecords: newWeatherRecords,
          weatherData: res,
          showWeather: true, // show the data once we have it
          showLoading: false // hide the loader
        }, () => {
          this.setState({
            enableMapClick: true
          })
        });

      })
      .catch((err) => {
        console.log(err)
      });
  }

  // // this is to show the popup over map markers for previously clicked points
  // showPopup() {
  //   let { x, y } = this.state.point;
  //   let { lat, lng } = this.state.coords;

  //   this.setState({
  //     popupCoords: {
  //       lat, lng, x, y
  //     }
  //   });
  // }

  // to delete popup
  removePopup() {

  }

  // when the user moves away from the popup
  hidePopup() {
    this.setState({
      marker: null,
    });
  }

  // the popup for a dropped pin will use this.state.marker
  // and this.state.weatherRecords to find the matching coordinates and 
  // show a little weather info
  renderPopup() {
    // console.log(this.state.marker)

    let { lat, lng } = this.state.marker.geometry.coordinates;
    let { x, y } = this.state.point;

    // console.log(lat, lng, x, y);

    let { weatherRecords } = this.state;

    // console.log(weatherRecords)

    // get the weather info from the matching record in this.state.weatherRecords
    let pastRecord = weatherRecords.find((el) => {
      // console.log(el.lng === lng, el.lat === lat)
      return el.longitude === lng && el.latitude === lat
    })
    // console.log('pastRecord');
    // console.log(pastRecord);

    if (pastRecord) {
      let divStyle = {
        // height: '150px',
        // width: '150px',
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
        margin: '4px',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 500
      }

      let { humidity, icon, summary, temperature,
        uvIndex, windSpeed, precipProbability } = pastRecord.currently;



      return (
        <div style={divStyle}>
          {!pastRecord ?
            <p>{`Lat: ${Math.floor(lat)}, Long: ${Math.floor(lng)}`}</p>
            :
            <div style={{ padding: '10px' }}>
              <p style={pStyle}>{`${pastRecord.fineLocation}`}</p>

              <div className="space-all-row">

                <div>
                  <p style={pStyle}>{summary}</p>
                </div>

                <div>
                  <div className="center-all-row">
                    <p style={pStyle}>{`${Math.floor(temperature)}`}&deg;F</p>
                    <p style={pStyle}>
                      <i className={getWeatherIcon(icon)} style={{ fontSize: '14px' }}></i>
                    </p>
                  </div>

                  <div className="center-all-row">
                    <p style={pStyle}>{`${precipProbability * 100}%`}</p>
                    <p style={pStyle}>
                      <i className="fas fa-cloud-rain" style={{ fontSize: '10px' }}></i>
                    </p>
                  </div>
                </div>
              </div>


            </div>
          }
        </div>
      )
    } else {
      return null;
    }

  }

  // this is called from within the Weather component, to close the 
  // weather window
  toggleShowWeather() {
    this.setState({
      showWeather: false
    }, () => {
    })
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

  // 
  render() {
    console.log(this.props.windowWidth)
    let mapStyle = {
      width: '100vw',
      height: this.props.windowWidth < 600 ? '88vh' : '92vh'
    }

    let bottomStyle = {
      backgroundColor: 'rgba(0,0,0,0.8)',
      width: '100vw',
      height: this.props.windowWidth < 600 ? '12vh' : '8vh'
    }

    return (
      <div style={styles.container}>

        {/* globe icon */}
        <i className="fas fa-globe-americas"></i>

        {/* the map itself */}
        <div id="map" style={mapStyle}>

          {/* the upper left text */}
          {<Intro coords={this.state.coords} />}

          {this.state.marker && this.state.weatherRecords ?
            this.renderPopup()
            : null
          }


        </div>
        {/* shows when the user clicks on the map */}

        <PoseGroup>

          {this.state.showLoading &&
            <Div style={styles.loaderHolder} key="loader">
              <Loader
                height={100}
                width={100}
                type="ThreeDots"
                color="#0000FF"
              />
            </Div>}

          {this.state.showWeather &&
            <Div key="weather">
              <Weather
                location={this.state.location}
                weatherData={this.state.weatherData}
                // coords={this.state.weatherCoords}
                close={this.toggleShowWeather}
              />
            </Div>}

        </PoseGroup>

        <div className="center-all-col" style={bottomStyle}>
          <a target="_blank"
            href="https://darksky.net/dev"
            alt="link to darksky">powered by DarkSky API</a>
          <a target="_blank"
            href="https://www.mapbox.com/"
            alt="link to darksky">powered by mapbox</a>
        </div>

      </div>
    );
  }
}

const styles = {
  container: {
    // margin: '3vw 3vh'
  },
  loaderHolder: {
    zIndex: 3,
    position: 'absolute',
    top: `calc(50vh - 50px)`,
    left: `calc(50vw - 50px)`
  },

}

export default windowSize(App);
