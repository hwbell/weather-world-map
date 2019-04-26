import React, { Component } from 'react';

// style
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

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
    let iconClass = getWeatherIcon(weather.icon);

    return (
      <div className="row" style={styles.container}>

        <div className="col">
          <i style={styles.icon} className={iconClass + ' col'}></i>
        </div>

        <div className="col">
          <div className="row">
            <p style={styles.temperature}>{weather.temperature}</p>
            <p style={styles.degree}>&deg;F</p>
          </div>
        </div>

        <div className="col">
          <p style={styles.paragraph}>{weather.summary}</p>
          <p style={styles.paragraph}>{`${weather.humidity}% humidity`}</p>
        </div>

        <div className="col">
          <p style={styles.paragraph}>{`${weather.date}`}</p>
          <p style={styles.paragraph}>{`${weather.time}`}</p>
        </div>

      </div>
    );
  }
}

const styles = {
  container: {
    margin: '10',
    marginLeft: '10vw'
  },
  icon: {
    fontSize: '60px',
    padding: '10px'
  },
  temperature: {
    fontSize: '40px',
    margin: '15px',
  },
  degree: {
    paddingTop: '10px',
    fontSize: '20px'
  },
  paragraph: {
    color: 'whitesmoke',
    fontSize: 'calc(10px + 1vw)',
    marginHorizontal: '20px',
    // paddingHorizontal: 12
  }
}

export default CurrentConditions;
