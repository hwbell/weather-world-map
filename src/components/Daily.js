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
    let temp = this.props.weatherList[0].temperatureHigh;
    // set range based on data
    myRainbow.setNumberRange(15, 95);
    myRainbow.setSpectrum('#303F9F', '#FF5722');

    let hourlyContainers = this.props.weatherList.map((weather, i) => {

      let style = {
        minWidth: '240px',
        height: '350px',
        backgroundColor: '#' + myRainbow.colourAt(weather.temperatureHigh),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }

      return (
        <Div key={i} className="" style={style}>

          {/* the timestamp */}
          <div className="row" style={styles.footer}>
            <p style={styles.text}>{weather.time}</p>
            <p style={styles.text}>{weather.date}</p>
          </div>

          {/* the temp and icon */}
          <div className="row">
            <div className="col">
              <i style={styles.icon} className={getWeatherIcon(weather.icon)}></i>
            </div>
            <div className="col">
              <p style={styles.highTempText}>{weather.temperatureHigh} &deg;F</p>
              <p style={styles.lowTempText}>{weather.temperatureLow} &deg;F</p>
            </div>
          </div>

          <p style={styles.paragraph}>
            {weather.summary}
          </p>

        </Div>
      )
    });

    return hourlyContainers;
  }

  render() {
    // console.log(this.props.weatherList)

    return (
      <Container className="" style={styles.container}>

        {/* <p style={styles.title}>daily</p> */}

        <div className="row">
          <HorizontalScroller>
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
    margin: '10px',
  },
  title: {
    margin: '5px',
    fontSize: 'calc(12px + 1vw )'
  },
  icon: {
    fontSize: '55px',
    color: 'rbga(255, 255, 255, 0.5)',
    padding: 10,
    paddingTop: 5
  },
  highTempText: {
    fontSize: 'calc(18px + 1vw)'
  },
  lowTempText: {
    fontSize: 'calc(12px + 1vw)'
  },
  footer: {
    alignSelf: 'flex-start',
    margin: '0.5vw'
  },
  text: {
    textAlign: 'center',
    minWidth: '50px',
    paddingHorizontal: 10,
    fontSize: 'calc(12px + 1vw)',
    fontWeight: 'bold'
  },
  paragraph: {
    textAlign: 'left',
    margin: '8px',
    fontSize: 'calc(10px + 1vw)',
  }
}

export default Hourly;
