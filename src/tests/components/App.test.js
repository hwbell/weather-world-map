import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import App from '../../App';
import CurrentConditions from '../../components/CurrentConditions';
import Daily from '../../components/Daily';
import Hourly from '../../components/Hourly';
import Intro from '../../components/Intro';
import Today from '../../components/Today';
import Weather from '../../components/Weather';
import { exportAllDeclaration } from '@babel/types';

// I got this mock documentation from 
// https://stackoverflow.com/questions/48866088/testing-a-react-mapbox-gl-with-jsodom-and-jest
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));

// shallow test components
test('should render App correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<App/>);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('should render CurrentConditions correctly', () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<CurrentConditions/>);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

