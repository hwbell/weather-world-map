## World Weather Map

This app was built as an open / public repo on github.com.
Find the source code at https://github.com/hwbell/weather-world-map

## How to run the app: 
Open a terminal and run the following commands: 
### `git clone https://github.com/hwbell/weather-world-map.git`
### `cd weather-world-map`
###  `npm install`
### `npm start`
The app gets its weather data through a Node.js backend hosted @ https://hb-weather-server.herokuapp.com/. The app itself is also deployed to @ https://hb-world-weather-map.herokuapp.com/. 

## Summary of tools used:
This app was made with: 

**create-react-app - https://github.com/facebook/create-react-app**
Initializes react project setup, very convenient.

**React.js - https://reactjs.org/**
Javascript framework for building UI.

**Bootstrap - https://getbootstrap.com/**
Makes flexible / responsive layouts simpler.

**Mapbox - https://www.mapbox.com/**
Makes using the zoomable map very easy.

**DarkySky API - https://darksky.net/dev**
Provides weather data used in the app. 

**Node.js / Express.js - https://nodejs.org/en/**
Upon a get request from the app / client, a Node.js backend is used to make the fetch to the DarkSky API, and the response is returned to to app / client. The app / client provides the latitude + longitude coordinates of the weather to be fetched by the server. Express is a great Node.js framework that makes a lot of server-side configurations very simple.

**Visual Studio Code - https://code.visualstudio.com/**
A great code editor with lots of built in features.

**Bash / Command Line - http://linuxcommand.org/**
The app runs from the terminal, whether locally or in the cloud. Tests and such are run from the terminal during development.

**Git - https://github.com/**
Used for version control.

## Npm packages - https://www.npmjs.com/
  Various npm packages were used for this app.
  
  mapbox-gl
  
  node-fetch
  
  node-open-geocoder
  
  rainbowvis.js
  
  react-horizontal-scroll-container
  
  react-pose
  
  Reactstrap

## Caveats
  open-geo-coder only returns reverse coded info for land points. So if you click on the open ocean, the app will only display latitude, longitude as the location. You’ll still get the weather.
The app is on heroku’s free dynos, so it may fall asleep. I’ve set up another app to ping it to stay awake, so it should always be up. If it looks like it is asleep, just give it a few seconds.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
