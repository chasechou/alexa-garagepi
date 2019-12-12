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
        console.log('garage-pi clickbutton:', action, ' name: ', name);
        garagepi(callback, action);
      }
    },
    {
      name: 'garage door sensor',
      port: 12001,
      handler: (action, name, callback) => {
        console.log('garageDoorSensor:', action, ' name: ', name);
        garageDoorSensor(callback, action);
      }
    }
  ]
});

function garageDoorSensor(callback, action) {
  const options = {
    method: 'GET',
    uri: `${server}/api/sensor`,
    qs: {
        state: action,
    }
  };
  console.log(callback);
  request(options)
    .then(function (response) {
      console.log('sensor: ' + response);
      callback(response == 'open' ? true : false);
    })
    .catch(function (err) {
      console.log('error: ' + err);
    });
}

function garagepi(callback, action) {
  const options = {
    method: 'GET',
    uri: server + '/api/openclose',
    qs: {
        state: action,
    }
  };
  request(options)
    .then(function (response) {
      console.log('done: ' + response);
      callback(response == 'open' ? true : false);
    })
    .catch(function (err) {
      console.log('error: ' + err);
    });
}

console.log('started..');
