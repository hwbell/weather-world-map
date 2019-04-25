import React, { Component } from 'react';

// styles
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';
import Hourly from './Hourly';

// animation with pose
import posed from 'react-pose';

// tools
import { weatherImageList, getWeatherIcon } from '../tools/weatherImages';

// use react-pose for fading in
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const P = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

// makeHourlyList() gets condensed info hourly info from the main response's hourly data
// we'll pass in res.hourly from the darksky res
const makeHourlyList = (hourlyData) => {

  // Dark Sky API makes this pretty convenient

  let condensedList = []; // we'll make a simple array for the days forecasted
  hourlyData.forEach((day) => {
    // get the date from the provided unix time 
    const time = new Date(day.time * 1000);

    // let year = time.getFullYear().toString().slice(0, 2);
    let date = time.getDate();
    let month = time.getMonth();

    let hour = time.getHours(); 
    let minutes = time.getMinutes();

    condensedList.push({
      desc: day.summary,
      icon: day.icon,
      temp: day.temperature,
      time: `${hour}: ${minutes}`,
      date: `${month + 1}-${date}` // need to correct for the api's month array
    });

  });

  return condensedList;
}

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

    // let { lat, lng } = this.props.coords;
    let hourlyWeather = makeHourlyList(this.props.weatherData.hourly.data);
    console.log(this.props.hourlyData)

    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} style={styles.container}>

        <Button onClick={this.props.toggle} className="float-right">
          <i className="fas fa-times-circle"></i>
        </Button>

        <Hourly weatherList={hourlyWeather}/>

      </Div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  }
}

export default Weather;
