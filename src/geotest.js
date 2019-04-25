const openGeocoder = require('node-open-geocoder');
 
openGeocoder()
  .reverse(-104.991531, 39.742243)
  .end((err, res) => {
    if (err) {
      throw(err)
    }

    let city = res.address.city;
    let state = res.address.state;
    console.log(`${city}, ${state}`)

  })