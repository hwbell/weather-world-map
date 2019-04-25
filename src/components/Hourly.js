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

    let hourlyContainers = this.props.weatherList.map((weather) => {
      return (
        <Div className="" style={styles.hourlyContainer}>

          {/* the temp and icon */}
          <div className="row">
            <div className="">
              <i style={styles.icon} className={getWeatherIcon(weather.icon)}></i>
            </div>
            <div className="">
              <p style={styles.text}>{weather.temp} &deg;F</p>
            </div>
          </div>

          {/* the timestamp */}
          <div className="">
            <p style={styles.text}>{weather.timestamp}</p>
          </div>

        </Div>
      )
    });

    return hourlyContainers;
  }

  render() {
    console.log(this.props.weatherList)

    return (
      <Container className="row">

        <HorizontalScroller>
          {this.props.weatherList &&
            this.renderWeatherInfo()
          }
        </HorizontalScroller>

      </Container>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  hourlyContainer: {
    border: '1px solid black',
    minWidth: '140px'
  },
  icon: {
    border: '1px solid black',
    padding: 10
  },
  text: {
    border: '1px solid black',
    minWidth: '50px',
    padding: 10
  }

}

export default Hourly;
