'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"testMy"',
  SERV_ADDR:'"http://61.136.101.202:6581/api"'  //https://test.icheyou.net/api =>https://test.icheyou.net/devapi
})
