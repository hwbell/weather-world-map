import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import App from '../../App';
import CurrentConditions from '../../components/CurrentConditions';
import Daily from '../../components/Daily';
import Hourly from '../../components/Hourly';
import Intro from '../../components/Intro';
import Weather from '../../components/Weather';

import { getWeatherIcon } from '../../tools/weatherImages';

let mockWeatherObj = {
  currently: {
    data: []
  }, 
  hourly: {
    data: []
  }, 
  daily: {
    data: []
  }
}


// I got this mock documentation from 
// https://stackoverflow.com/questions/48866088/testing-a-react-mapbox-gl-with-jsodom-and-jest
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}))
jest.mock('../../tools/weatherImages')

// shallow test components
test('should render App correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<App />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('should render CurrentConditions correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<CurrentConditions weather={{ icon: 'fas fa-sun' }} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('should render Daily correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<Daily />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('should render Hourly correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<Hourly />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('should render Intro correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<Intro />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('should render Weather correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<Weather weatherData={mockWeatherObj}/>);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});


// def need more testing for fetch's and functionality

