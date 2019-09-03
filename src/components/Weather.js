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
  enter: {
    y: 0,
    opacity: 1,
    delay: 300,
    transition: {
      y: { type: 'spring', stiffness: 100, damping: 15 },
      default: { duration: 300 }
    }
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { duration: 150 }
  }
});

// can just make it empty if you only want it to follow the other animations
// but not animate itself
const P = posed.p({});

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

  let hours = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
  let notation = time.getHours() > 11 ? ' pm' : ' am';

  if (hours === 0) {
    hours = 12;
  }
  
  let { humidity, icon, summary, temperature, uvIndex, windSpeed, precipProbability } = currentData;

  return {
    humidity, icon, summary, uvIndex, windSpeed, precipProbability,
    temperature: Math.floor(temperature),
    time: `${hours}:00 ${notation}`,
    date: `${time.getMonth() + 1}/${date}/${year}`
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
    let weekday = days[time.getDay()].slice(0, 3);

    let hours = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
    let notation = time.getHours() > 11 ? ' pm' : ' am';

    if (hours === 0) {
      hours = 12;
    }
    condensedList.push({
      desc: hour.summary,
      icon: hour.icon,
      temp: Math.floor(hour.temperature),
      time: `${hours}:00 ${notation}`,
      date: `${weekday.slice(0,3)}, ${month.slice(0,3)} ${date}`
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
    let weekday = days[time.getDay()].slice(0, 3);

    condensedList.push({
      temperatureHigh: Math.floor(day.temperatureHigh),
      temperatureLow: Math.floor(day.temperatureLow),
      summary: day.summary,
      humidity: day.humidity,
      icon: day.icon,
      windSpeed: day.windSpeed,
      precipProbability: day.precipProbability,
      date: `${weekday.slice(0,3)}, ${month.slice(0,3)} ${date}`
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
    console.log(this.state.showDaily, this.state.showHourly)
    this.setState({
      showDaily: !this.state.showDaily,
      showHourly: !this.state.showHourly
    })
  }

  render() {
    const data = this.props.weatherData;

    // make condensed lists to pass to the CurrentConditions, Hourly, Daily components
    let hourlyWeather = makeHourlyList(data.hourly.data);

    let currentWeather = getCurrentData(data.currently);

    // only pass the first 15 days, this list is really long
    let dailyWeather = makeDailyList(data.daily.data).slice(0, 16);

    // change the summary based on hourly vs. daily
    let summary = this.state.showDaily ? data.daily.summary : data.hourly.summary;

    return (

      <Div style={styles.container}>

        <Button color='link' onClick={this.props.close} className="float-right">
          <i style={styles.icon} className="fas fa-times-circle"></i>
        </Button>

        <p style={styles.title}>{this.props.weatherData.fineLocation}</p>


        {/* the current conditions */}
        {currentWeather &&
          <CurrentConditions
            weather={currentWeather} />}

        {/* the selector for hourly / daily */}
        <Button color="link" style={styles.switchButton}
          onClick={this.handleSwitch}
        >
          switch to {this.state.showHourly ? 'daily' : 'hourly'}
        </Button>

        {/* animate the switch */}
        <PoseGroup>
          <Div key={'hourly'}>
            {/* the hourly weather tabs  */}
            {this.state.showHourly && <Hourly key={'hourly'} weatherList={hourlyWeather} />}

            {/* the daily weather tabs */}
            {this.state.showDaily && <Daily key={'daily'} weatherList={dailyWeather} />}
          </Div>

          {/* short summary */}
          <P key="text" style={styles.subtitle}>{summary}</P>

        </PoseGroup>



      </Div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: '25px',
    zIndex: 2,
    position: 'absolute',
    top: '15%',
    left: '5%',
    // height: '70%',
    width: '90%',
  },
  icon: {
    marginTop: '7px',
    fontSize: '24px'
  },
  title: {
    // fontWeight: 'bold',
    color: 'whitesmoke',
    fontSize: 'calc(14px + 1vw)',
    margin: '2vw',
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
    fontSize: '16px',
    fontWeight: 'bold',
    marginLeft: '9vw'
  }
}

export default Weather;
