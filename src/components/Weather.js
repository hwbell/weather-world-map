import React, { Component } from 'react';

// styles
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import { Button } from 'reactstrap';
import Hourly from './Hourly';
import Daily from './Daily'
;
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
  hourlyData.forEach((hour) => {
    // get the date from the provided unix time 
    const time = new Date(hour.time * 1000);

    // let year = time.getFullYear().toString().slice(0, 2);
    let date = time.getDate();
    let month = time.getMonth();

    let hours = time.getHours() > 12 ? time.getHours() - 11 : time.getHours() + 1;
    let notation = time.getHours() > 10 ? ' pm' : ' am';

    condensedList.push({
      desc: hour.summary,
      icon: hour.icon,
      temp: Math.floor(hour.temperature),
      time: `${hours} ${notation}`,
      date: `${month + 1}-${date}` // need to correct for the api's month array
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

    // make condensed lists to pass to the Hourly and Daily components
    let hourlyWeather = makeHourlyList(data.hourly.data);

    // only pass the first 10 days, this list is really long
    let dailyWeather = makeDailyList(data.daily.data).slice(0, 10);

    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} style={styles.container}>

        <Button onClick={this.props.close} className="float-right">
          <i className="fas fa-times-circle"></i>
        </Button>

        <p style={styles.title}>{this.props.location}</p>
        <p style={styles.subtitle}>{this.props.summary}</p>

        {/* <Hourly weatherList={hourlyWeather}/> */}

        <Daily weatherList={dailyWeather}/>

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
  title: {
    // border: '1px solid black',
    color: 'whitesmoke',
    fontSize: 'calc(14px + 1vw)',
    padding: 10
  },
  subtitle: {
    color: 'whitesmoke',
    fontSize: 'calc(10px + 1vw)',
    padding: 10
  }
}

export default Weather;
