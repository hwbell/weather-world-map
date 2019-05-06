import React, { Component } from 'react';

// style
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation with pose
import posed from 'react-pose';

// tools
import { weatherImagesList, getWeatherIcon } from '../tools/weatherImages';

// use react-pose for fading in
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const P = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

class CurrentConditions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 
    }
  }

  componentDidMount() {
    // 
  }

  render() {
    let weather = this.props.weather;

    return (
      <div className="row" style={styles.container}>

        <div className="" style={styles.infoHolder}>
          <p style={styles.temperature}>{weather.temperature}&deg;F</p>
          <p style={styles.paragraph}>{`${weather.time}`}</p>
        </div>

        <div className="" style={styles.infoHolder}>
          <p style={styles.paragraph}>
            <i style={styles.icon} className={getWeatherIcon(weather.icon)}></i>
          </p>
          <p style={styles.paragraph}>{weather.summary}</p>

        </div>

        <div className="" style={styles.infoHolder}>
          <p style={styles.paragraph}>{`humidity: ${weather.humidity}%`}</p>
          <p style={styles.paragraph}>{`precipitation: ${weather.precipProbability} %`}</p>
          <p style={styles.paragraph}>{`wind: ${Math.floor(weather.windSpeed)} mph`}</p>

        </div>

      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: '10',
    // marginLeft: '10vw'
  },
  icon: {
    fontSize: '50px',
    paddingBottom: '0px'
    // paddingLeft: '30px'
  },
  infoHolder: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80px'
  },
  temperature: {
    fontSize: '30px',
    margin: '0px'
  },
  paragraph: {
    textAlign: 'center',
    color: 'whitesmoke',
    fontSize: 'calc(8px + 1vw)',
    marginHorizontal: '20px',
    padding: '0px',
    display: 'inline-block'
    // paddingHorizontal: 12
  }
}

export default CurrentConditions;
