import React, { Component } from 'react';

// style
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation with pose
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
    
    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} style={styles.container}>
        
        <P style={styles.title}>take a look around</P>
        <P style={styles.subtitle}>click anywhere you'd like to see the weather</P>

      </Div>
    );
  }
}

const styles = {
  container: {
    zIndex: 1,
    position: 'absolute',
    top: '30px',
    left: '20px',
  },
  title: {
    marginLeft: '20px',
    color: '#283747',
    fontSize: 'calc(16px + 2vw)'
  },
  subtitle: { 
    margin: '25px',
    color: '#283747',
    fontWeight: 'bold',
    fontSize: 'calc(10px + 1vw)'
  },
}

export default Intro;
