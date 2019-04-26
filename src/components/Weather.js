import React, { Component } from 'react';

// styles
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button, Modal } from 'reactstrap';
import Hourly from './Hourly';
import Daily from './Daily';
import CurrentConditions from './CurrentConditions';

// animation with pose
import posed, { PoseGroup } from 'react-pose';

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

// need arrays of Months and Days to get names
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// getCurrentData() gets condensed info for the CurrentConditions component, 
// from res.currently we'll pass in res.currently from the darksky res
const getCurrentData = (currentData) => {

  // Dark Sky API makes this pretty convenient

  // get the date from the provided unix time 
  const time = new Date(currentData.time * 1000);

  let year = time.getFullYear().toString();
  let date = time.getDate();
  let month = months[time.getMonth()];

  let hours = time.getHours() > 12 ? time.getHours() - 11 : time.getHours() + 1;
  let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes.toString() : time.getMinutes();
  let notation = time.getHours() > 10 ? ' pm' : ' am';

  let { humidity, icon, summary, temperature, uvIndex, windSpeed } = currentData;

  return {
    humidity, icon, summary, uvIndex, windSpeed,
    temperature: Math.floor(temperature),
    time: `${hours}:00 ${notation}`,
    date: `${month} ${date}, ${year}`
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
    let month = months[time.getMonth()];

    let hours = time.getHours() > 12 ? time.getHours() - 11 : time.getHours() + 1;
    let notation = time.getHours() > 10 ? ' pm' : ' am';

    condensedList.push({
      desc: hour.summary,
      icon: hour.icon,
      temp: Math.floor(hour.temperature),
      time: `${hours}:00 ${notation}`,
      date: `${month} ${date}`
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

    // let year = time.getFullYear().toString();
    let date = time.getDate();
    let month = months[time.getMonth()];
    let weekday = days[time.getDay()];

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
      date: `${weekday}, ${month} ${date}` // need to correct for the api's month array
    });

  });

  return condensedList;
}



class Weather extends Component {

  constructor(props) {

    super(props);
    this.state = {
      showDaily: true,
      showHourly: false
    }
    this.handleSwitch = this.handleSwitch.bind(this);
  }

  componentDidMount() {

  }

  // for the toggle between hourly and daily
  handleSwitch() {
    this.setState({
      showDaily: !this.state.showDaily,
      showHourly: !this.state.showHourly
    })
  }

  render() {
    const isVisible = this.props.showWeather;
    const data = this.props.weatherData;

    // make condensed lists to pass to the CurrentConditions, Hourly, Daily components
    let hourlyWeather = makeHourlyList(data.hourly.data);

    let currentWeather = getCurrentData(data.currently);

    // only pass the first 7 days, this list is really long
    let dailyWeather = makeDailyList(data.daily.data).slice(0, 8);

    // change the summary based on hourly vs. daily
    let summary = this.state.showDaily ? data.daily.summary : data.hourly.summary;

    return (

      <Div pose={isVisible ? 'visible' : 'hidden'} style={styles.container}>

        <Button color='link' onClick={this.props.close} className="float-right">
          <i style={styles.icon} className="fas fa-times-circle"></i>
        </Button>

        <p style={styles.title}>{this.props.location}</p>


        {/* the current conditions */}
        {currentWeather &&
          <CurrentConditions
            weather={currentWeather} />}

        {/* short summary */}
        <p style={styles.subtitle}>{summary}</p>

        {/* the selestor for hourly / daily */}
        <Button color="link" style={styles.switchButton}
          onClick={this.handleSwitch}
        >
          switch to {this.state.showHourly ? 'daily' : 'hourly'}
        </Button>

        {/* animate the switch */}
        <PoseGroup>
          <Div key={'hourly'}>
            {/* the hourly weather tabs  */}
            {this.state.showHourly && <Hourly weatherList={hourlyWeather} />}
          </Div>

          <Div key={'daily'}>
            {/* the daily weather tabs */}
            {this.state.showDaily && <Daily weatherList={dailyWeather} />}
          </Div>
        </PoseGroup>

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
    height: '550px',
    width: '100%',
  },
  icon: {
    fontSize: '24px'
  },
  title: {
    fontWeight: 'bold',
    color: 'whitesmoke',
    fontSize: 'calc(14px + 1vw)',
    marginLeft: '5vw',
    padding: '10px'
  },
  subtitle: {
    color: 'whitesmoke',
    fontSize: 'calc(10px + 1vw)',
    margin: '3vh',
    marginLeft: '10vw',
  },
  switchButton: {
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    marginLeft: '9vw'
  }
}

export default Weather;
