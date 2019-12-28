'use strict';

require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss');

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
        sendRequest(action, name, callback, '/api/clickbutton');
      }
    },
    {
      name: 'garage door sensor',
      port: 12001,
      handler: (action, name, callback) => {
        sendRequest(action, name, callback, '/api/sensor');
      }
    }
  ]
});

function sendRequest(action, name, callback, api) {
  if(action === 'status') {
    api = '/api/status';
  } else {
    console.log(`name:  ${name}  action: ${action}  api: ${api}`);
  }

  const options = {
    method: 'GET',
    uri: server + api,
    qs: {
        state: action,
    }
  };
  request(options)
    .then(function (response) {
      const state = response === 'open' ? true : false;
      callback(state);
    })
    .catch(function (err) {
      console.log(`name:  ${name}  action: ${action}  error: ${err}`);
    });
}

console.log('started..');
