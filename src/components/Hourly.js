import React, { Component } from 'react';

// styles
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';
import HorizontalScroller from 'react-horizontal-scroll-container';

// animation with pose
import posed from 'react-pose';

// tools
import { weatherImageList, getWeatherIcon } from '../tools/weatherImages';
var Rainbow = require('rainbowvis.js');

// use react-pose for fading in
const Container = posed.div({
  enter: { staggerChildren: 50 },
  exit: { staggerChildren: 50, staggerDirection: -1 }
});

const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

class Hourly extends Component {

  constructor(props) {

    super(props);
    this.state = {
      //
    }
  }

  componentDidMount() {

  }

  renderWeatherInfo() {

    // initalize rainbowvis to color each group dynamically
    var myRainbow = new Rainbow();

    // make a spectrum based on the first temp in the list
    let temp = this.props.weatherList[0].temp;
    // set range based on data
    myRainbow.setNumberRange(-15, 100);
    myRainbow.setSpectrum('#303F9F', '#FF5722');

    let hourlyContainers = this.props.weatherList.map((weather, i) => {

      let style = {
        minWidth: '120px',
        border: '1px solid rgba(245, 245, 245, 0.2)',
        backgroundColor: '#' + myRainbow.colourAt(weather.temp)
      }

      return (
        <Div key={i} className="" style={style}>

          {/* the temp and icon */}
          <div className="">
            <i style={styles.icon} className={getWeatherIcon(weather.icon)}></i>
          </div>
          <div className="">
            <p style={styles.temp}>{weather.temp} &deg;F</p>
          </div>

          {/* the timestamp */}
          <p style={styles.text}>{weather.time}</p>
          <p style={styles.text}>{weather.date}</p>

        </Div>
      )
    });

    return hourlyContainers;
  }

  render() {
    // console.log(this.props.weatherList)

    return (
      <Container className="" style={styles.container}>

        <div className="">
          <HorizontalScroller style={styles.scroller}>
            {this.props.weatherList &&
              this.renderWeatherInfo()
            }
          </HorizontalScroller>
        </div>


      </Container>
    );
  }
}

const styles = {
  container: {
    width: '95%',
    margin: 'auto auto',
  },
  scroller: {
    overflowX: 'hidden',
    // margin: '0px',
    // padding: '0px'
  },
  temp: {
    textAlign: 'center',
    margin: 5,
    fontSize: '24px'
  },
  icon: {
    fontSize: '40px',
    textAlign: 'center',
    padding: '15px',
    paddingTop: '10px'
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 10
  }

}

export default Hourly;
