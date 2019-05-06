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

var ScrollArea = require('react-scrollbar');

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
    myRainbow.setNumberRange(-15, 100);
    myRainbow.setSpectrum('#303F9F', '#FF5722');

    let hourlyContainers = this.props.weatherList.map((weather, i) => {

      let style = {
        minWidth: '160px',
        padding: 0,
        margin: 0,
        border: '1px solid rgba(245, 245, 245, 0.2)',
        backgroundColor: '#' + myRainbow.colourAt(weather.temperatureHigh),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }

      return (
        <Div key={i} className="" style={style}>

          {/* the timestamp */}
          <div className="text-center row" style={styles.date}>
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

        <div className="" style={{borderRadius: '55px'}}>
          <HorizontalScroller className="horizontal-scroller" style={styles.scroller}>
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
  title: {
    margin: '5px',
    fontSize: '12px',
    alignSelf: 'flex-start'
  },
  icon: {
    fontSize: '45px',
    padding: 10,
    paddingTop: 5
  },
  highTempText: {
    fontSize: '20px'
  },
  lowTempText: {
    fontSize: '14px'
  },
  date: {
    marginTop: '10px'
  },
  text: {
    textAlign: 'center',
    minWidth: '50px',
    paddingHorizontal: 10,
    fontSize: '18px',
    fontWeight: 'bold'
  },
  paragraph: {
    textAlign: 'left',
    margin: '8px',
    marginTop: '20px',
    fontSize: '14px',
  }
}

export default Hourly;
