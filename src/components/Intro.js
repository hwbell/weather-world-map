import React, { Component } from 'react';

// style
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation with pose
import posed from 'react-pose';

// components
import {Button} from 'reactstrap';

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

    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} className="" style={styles.container}>

        <P style={styles.title}>take a look around</P>
        <P style={styles.subtitle}>click anywhere to see the weather</P>

        {this.props.coords &&
          <div className="">
            <P style={styles.coords}>{`latitude: ${Math.round(this.props.coords.lat * 100) / 100}`}</P>
            <P style={styles.coords}>{`longitude: ${Math.round(this.props.coords.lng * 100) / 100}`}</P>
          </div>}

      </Div>
    );
  }
}

const styles = {
  container: {
    zIndex: 1,
    position: 'absolute',
    top: '5%',
    // width: 'calc(300px + 6vw)',
    // height: 'calc(180px + 8vh)',
    borderRadius: '30px',
    margin: '20px',
  },
  title: {
    padding: '10px',
    color: 'black',
    fontSize: 'calc(20px + 1vw)'
  },
  subtitle: {
    padding: '10px',
    color: 'black',
    fontSize: 'calc(16px + 0.5vw)'
  },
  coords: {
    padding: '10px',
    fontSize: 'calc(12px + 0.5vw)',
    color: 'black',
  },
  icon: {
    color: 'black'
  }

}

export default Intro;
