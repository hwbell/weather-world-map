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
    marginLeft: '20px',
    color: 'black',
    fontWeight: 'bold',
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
