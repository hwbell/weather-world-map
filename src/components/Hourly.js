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
    myRainbow.setNumberRange(15, 95); 
    myRainbow.setSpectrum('#1976D2', '#FF5722');

    let hourlyContainers = this.props.weatherList.map((weather, i) => {

      let style = {
        minWidth: '140px',
        backgroundColor: '#' + myRainbow.colourAt(weather.temp)
      }

      return (
        <Div key={i} className="" style={style}>

          {/* the temp and icon */}
          <div className="row">
            <div className="col">
              <i style={styles.icon} className={getWeatherIcon(weather.icon)}></i>
            </div>
            <div className="col">
              <p style={styles.text}>{weather.temp} &deg;F</p>
            </div>
          </div>

          {/* the timestamp */}
          <div className="">
            <p style={styles.text}>{weather.time}</p>
            <p style={styles.text}>{weather.date}</p>
          </div>

        </Div>
      )
    });

    return hourlyContainers;
  }

  render() {
    // console.log(this.props.weatherList)

    return (
      <Container className="" style={styles.container}>

        {/* <p style={styles.title}>hourly</p> */}

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
    padding: '0px',
    margin: '15px'
  },

  title: {
    margin: 5,
    fontSize: 'calc(12px + 1vw )'
  },
  icon: {
    fontSize: '50px',
    textAlign: 'center',
    padding: '15px',
    paddingTop: '5px'
  },
  text: {
    textAlign: 'center',
    minWidth: '50px',
    paddingHorizontal: 10
  }

}

export default Hourly;
