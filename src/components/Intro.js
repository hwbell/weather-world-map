import React, { Component } from 'react';

// style
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// animation with pose
import posed, { PoseGroup } from 'react-pose';

// components
import { Button } from 'reactstrap';

// tools
import Media from 'react-media';
import windowSize from 'react-window-size';

// use react-pose for fading in
const Div = posed.div({
  enter: {
    opacity: 1,
    duration: 3000
  },
  exit: {
    opacity: 0,
    duration: 100
  }
});

const P = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
});

class Intro extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      showFullContent: false
    }

    this.toggleFullContent = this.toggleFullContent.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isVisible: true });
    }, 1200);
  }

  toggleFullContent() {
    this.setState({
      showFullContent: !this.state.showFullContent
    })
  }

  render() {
    const isVisible = this.state.isVisible;

    let lat = this.props.coords ? Math.round(this.props.coords.lat * 100) / 100 : ` ... `;
    let lng = this.props.coords ? Math.round(this.props.coords.lng * 100) / 100 : ` ... `;

    let containerStyle = {
      // width: 'calc(100vw - 40px)',
      maxWidth: this.props.windowWidth > 500 ? 500 : 300,
      zIndex: 1,
      position: 'absolute',
      bottom: '5%',
      right: '0px',
      borderRadius: '6px',
      margin: '10px',
      padding: '8px',
      backgroundColor: 'rgba(0,0,0,0.75)',
    }

    return (
      <Div pose={isVisible ? 'visible' : 'hidden'} className="left-all-col" style={containerStyle}>

        <PoseGroup className="intro-container">

          {this.state.showFullContent ?

            <Div key="full" pose={this.state.showFullContent ? 'visible' : 'hidden'}>

              <Button size="sm" color="primary" style={styles.toggleIcon} onClick={this.toggleFullContent}>
                <i className="fas fa-times"></i>
              </Button>

              <P style={styles.title}>Take a look around!</P>
              <P style={styles.subtitle}>{`You can click anywhere on the map to see the weather. If you need to 
            search a location, use the search bar at the top of the map. Explore and have fun!`}</P>

              <div className="">
                <P style={styles.coords}>{`latitude: ${lat}`}</P>
                <P style={styles.coords}>{`longitude: ${lng}`}</P>
              </div>
            </Div> :

            <Div key="partial" className="left-all-row">

              {/* this tracking won't shup on mobile correctly so just hide it */}
              <Media query="(max-width: 599px)">
                {matches =>
                  matches ? (
                    null
                  ) : (
                      <div style={{ width: '140px' }}>
                        <P style={styles.coords}>{`latitude: ${lat}`}</P>
                        <P style={styles.coords}>{`longitude: ${lng}`}</P>
                      </div>
                    )
                }
              </Media>

              <Button size="sm" className="tiny-button" color="primary"
                onClick={this.toggleFullContent}>
                <i className="fas fa-question"></i>
              </Button>

            </Div>}

        </PoseGroup>

      </Div >
    );
  }
}

const styles = {
  toggleIcon: {
    position: 'absolute',
    top: '15px',
    right: '15px',
  },
  title: {
    padding: '10px',
    fontSize: '16px'
  },
  subtitle: {
    padding: '10px',
    fontSize: '14px'
  },
  coords: {
    padding: '10px',
    fontSize: '12px'
  },

}

export default windowSize(Intro);
