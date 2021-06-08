
const path = require('path')
// load environment variables
require('dotenv').config()

// ? should we default this?
process.env.DATA = process.env.DATA || path.join(__dirname, '__data')

const main = require('@hyper63/core')

const defaultConfig = require('./hyper63.config')

function extend (fn) {
  return fn(defaultConfig)
}

function start (hyperConfig) {
  return main(hyperConfig)
}

module.exports = {
  extend,
  start
}
