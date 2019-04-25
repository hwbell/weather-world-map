import React, { Component } from 'react';

// styles
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';

// animation with pose
import posed from 'react-pose';

// use react-pose for fading in
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const P = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

// use the cities module for the location of the weather,
// as darksky's is too broad sometimes.
var cities = require('cities');

class Weather extends Component {

  constructor(props) {

    super(props);
    this.state = {
      //
    }
  }

  componentDidMount() {

  }

  render() {
    const isVisible = this.props.showWeather;

    let { lat, lng } = this.props.coords;
    let city = cities.gps_lookup(lat, lng);

    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} style={styles.container}>

        <Button onClick={this.props.toggle} className="float-right" >
          <i className="fas fa-times-circle"></i>
        </Button>

        <Div className="">
          <P>{JSON.stringify(this.props.weather)}</P>
        </Div>

      </Div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: '300px',
    width: '400px', 
    zIndex: 1,
    position: 'absolute',
    top: '50%',
    right: '10%'
  }
}

export default Weather;
