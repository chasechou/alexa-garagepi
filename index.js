'use strict';

const FauxMo = require('fauxmojs');
const request = require('request-promise');
const ipAddress = '192.168.86.60';
const server = 'http://127.0.0.1:8000';

let fauxMo = new FauxMo({
  ipAddress: ipAddress,
  devices: [
    {
      name: 'garage',
      port: 12000,
      handler: (action, name, callback) => {
        console.log('garage-pi clickbutton:', action);
        garagepi(callback);
      }
    }
  ]
});

function garagepi(callback) {
  const options = {
    method: 'GET',
    uri: server + '/api/clickbutton',
  };
  request(options)
    .then(function (response) {
      console.log('done: ' + response);
      callback(false);
    })
    .catch(function (err) {
      console.log('error: ' + err);
    });
}

console.log('started..');
