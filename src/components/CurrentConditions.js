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

          <p style={styles.temperature}>{weather.temperature} &deg;F</p>
        </div>

        <div className="col">
          <p style={styles.paragraph}>{weather.summary}</p>
          <p style={styles.paragraph}>{`${weather.humidity}% humidity`}</p>
        </div>

        <div className="col">
          <p style={styles.paragraph}>{` @ ${weather.time}`}</p>
          <p style={styles.paragraph}>{`${weather.date}`}</p>
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
    fontSize: 'calc(34px + 1vw)',
    marginHorizontal: '20px'
  },
  paragraph: {
    color: 'whitesmoke',
    fontSize: 'calc(12px + 1vw)',
    marginHorizontal: '20px',
    // paddingHorizontal: 12
  }
}

export default CurrentConditions;
