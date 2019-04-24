import React, { Component } from 'react';

// style
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

import posed from 'react-pose';

// use react-pose for fading in
const Div = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

const P = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

class Intro extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isVisible: true });
    }, 800);
  }

  render() {
    const isVisible = this.state.isVisible;
    const lat = Math.round(this.props.coords.lat * 100) / 100;
    const lng = Math.round(this.props.coords.lng * 100) / 100;

    console.log(this.props.coords)
    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} style={styles.container}>
        <P style={styles.title}>Welcome</P>
        <P style={styles.subtitle}>take a look around</P>

        <div className="" style={styles.coordsHolder}>
          <p style={styles.coords}>{`latitude: ${lat}`}</p>
          <p style={styles.coords}>{`longitude: ${lng}`}</p>
        </div>

      </Div>
    );
  }
}

const styles = {
  container: {
    zIndex: 1,
    position: 'absolute',
    top: '50px',
    left: '30px'
  },
  title: {
    margin: '20px',
    marginTop: '0px',
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 'calc(30px + 2vw)'
  },
  subtitle: {
    margin: '30px',
    color: 'black',
    fontSize: 'calc(16px + 2vw)'
  },
  coordsHolder: {
    margin: '30px'
  },
  coords: {
    fontSize: 'calc(10px + 1vw)'
  }
}

export default Intro;
