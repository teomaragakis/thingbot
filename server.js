var fs = require('fs');
var request = require('request');
var random = require('generate-random-data');

function setup(values) {
  console.log('Initiating Setup');
  hello(values[0], values[1]);
}

var config = new Promise((resolve, reject) => {
  fs.readFile('config.json', 'utf8', function (err, configData) {
    if (err)
      reject(err);
    var config = JSON.parse(configData);
    //console.log(config);
    resolve(config);
  });
});

var things = new Promise((resolve, reject) => {
  fs.readFile('thing.json', 'utf8', function (err, thingData) {
    if (err)
      reject(err);
    var thing = JSON.parse(thingData);
    //console.log(thing);
    resolve(thing);
  });
});

Promise.all([config, things])
  .then(values => {
    setup(values);
    return values;
  })
  .then(values => {
    console.log(values);
    run(values[1].info.interval);
  })
  .catch(reason => {
    console.log(reason)
  });

function run(interval) {
  setInterval(loop, interval);
}

function loop() {
  // code to run
  console.log('loop.');
}

function hello(config, data) {

  var server = config.server;
  

  var thingInfo = data.info;
  //console.log(thingInfo);

  var options = {
    uri: 'http://' + server.host + ':' + server.port + server.helloUrl + '?hwid=' + thingInfo.hardwareKey,
    method: 'POST',
    json: thingInfo
  };
  //console.log(options);

  request(options, function (error, response, body) {
    console.log('Server response: %s', body);
      if (!error) {
        switch(response.statusCode) {
          case 200:
            console.log('Server recognized thing!');
          break;
          case 201:
            console.log('Server created a new thing!');
          break;
          default:
            console.log('Weird shit happened with code %s', response.statusCode);
        }
      } else {
        console.log(error);
      }
  });
}