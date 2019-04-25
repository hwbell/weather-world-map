import React, { Component } from 'react';

// styles
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';
import Hourly from './Hourly';
import Daily from './Daily';
import CurrentConditions from './CurrentConditions';

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

// getCurrentData() gets condensed info from res.currently
// we'll pass in res.currently from the darksky res
const getCurrentData = (currentData) => {

  // Dark Sky API makes this pretty convenient

  // get the date from the provided unix time 
  const time = new Date(currentData.time * 1000);

  let year = time.getFullYear().toString().slice(2, 4);
  let date = time.getDate();
  let month = time.getMonth();

  let hours = time.getHours() > 12 ? time.getHours() - 11 : time.getHours() + 1;
  let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes.toString() : time.getMinutes();
  let notation = time.getHours() > 10 ? ' pm' : ' am';

  let { humidity, icon, summary, temperature, uvIndex, windSpeed } = currentData;

  return {
    humidity, icon, summary, uvIndex, windSpeed,
    temperature: Math.floor(temperature),
    time: `${hours} ${notation}`,
    date: `${month + 1} - ${date} - ${year}`
  };
}

// makeHourlyList() gets condensed info hourly info from the main response's hourly data
// we'll pass in res.hourly from the darksky res
const makeHourlyList = (hourlyData) => {

  // Dark Sky API makes this pretty convenient

  let condensedList = []; // we'll make a simple array for the days forecasted
  hourlyData.forEach((hour) => {
    // get the date from the provided unix time 
    const time = new Date(hour.time * 1000);

    let year = time.getFullYear().toString().slice(0, 2);
    let date = time.getDate();
    let month = time.getMonth();

    let hours = time.getHours() > 12 ? time.getHours() - 11 : time.getHours() + 1;
    let notation = time.getHours() > 10 ? ' pm' : ' am';

    condensedList.push({
      desc: hour.summary,
      icon: hour.icon,
      temp: Math.floor(hour.temperature),
      time: `${hours} ${notation}`,
      date: `${month + 1} / ${date} / ${year}` // need to correct for the api's month array
    });

  });

  return condensedList;
}

// makeHourlyList() gets condensed info hourly info from the main response's hourly data
// we'll pass in res.daily from the darksky res
const makeDailyList = (dailyData) => {

  // Dark Sky API makes this pretty convenient

  let condensedList = []; // we'll make a simple array for the days forecasted
  dailyData.forEach((day) => {
    // get the date from the provided unix time 
    const time = new Date(day.time * 1000);

    // let year = time.getFullYear().toString().slice(0, 2);
    let date = time.getDate();
    let month = time.getMonth();

    let {
      temperatureHigh,
      temperatureLow,
      summary,
      humidity,
      icon,
      windSpeed,
    } = day;

    condensedList.push({
      temperatureHigh: Math.floor(temperatureHigh),
      temperatureLow: Math.floor(temperatureLow),
      summary,
      humidity,
      icon,
      windSpeed,
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
    const data = this.props.weatherData;

    // make condensed lists to pass to the CurrentConditions, Hourly, Daily components


    let hourlyWeather = makeHourlyList(data.hourly.data);

    let currentWeather = getCurrentData(data.currently)

    // only pass the first 7 days, this list is really long
    let dailyWeather = makeDailyList(data.daily.data).slice(0, 8);

    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} style={styles.container}>

        <Button color='link' onClick={this.props.close} className="float-right">
          <i style={styles.icon} className="fas fa-times-circle"></i>
        </Button>

        <p style={styles.title}>{this.props.location}</p>
        

        {/* the current conditions */}
        {currentWeather &&
          <CurrentConditions weather={currentWeather} />}

        {/* short summary */}
        <p style={styles.subtitle}>{this.props.summary}</p>

        {/* the hourly weather tabs  */}
        {/* <Hourly weatherList={hourlyWeather}/> */}

        {/* the daily weather tabs */}
        <Daily weatherList={dailyWeather} />

      </Div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 1,
    position: 'absolute',
    bottom: '0px',
    width: '100%',

    // right: '10%'
  },
  icon: {
    fontSize: '24px'
  },
  title: {
    // border: '1px solid black',
    color: 'whitesmoke',
    fontSize: 'calc(14px + 1vw)',
    padding: 10
  },
  subtitle: {
    color: 'whitesmoke',
    fontSize: 'calc(10px + 1vw)',
    marginLeft: '10vw' 
  }
}

export default Weather;
