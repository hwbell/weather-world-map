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
      <Div pose={isVisible ? 'visible' : 'hidden'} className="text-center" style={styles.container}>
        <Button color='link' onClick={this.props.close} className="float-right">
          <i style={styles.icon} className="fas fa-times-circle"></i>
        </Button>

        <P style={styles.title}>take a look around</P>
        <P style={styles.subtitle}>click anywhere to see the weather</P>

        {this.props.coords &&
          <div className="">
            <P style={styles.subtitle}>{`latitude: ${Math.round(this.props.coords.lat * 100) / 100}`}</P>
            <P style={styles.subtitle}>{`longitude: ${Math.round(this.props.coords.lng * 100) / 100}`}</P>
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
    left: '5%',
    width: 'calc(300px + 6vw)',
    height: 'calc(180px + 8vh)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '30px'

  },
  title: {
    padding: '20px',
    marginLeft: '20px',
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 'calc(16px + 1vw)'
  },
  subtitle: {
    textAlign: 'left',
    margin: '20px',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 'calc(12px + 0.5vw)'
  },
  icon: {
    color: 'black'
  }

}

export default Intro;
