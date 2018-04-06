// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require ('babel-polyfill');
require ('babel-plugin-transform-runtime');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777'
    }
  },
    mocha: {
        useColors: true
    }
}
