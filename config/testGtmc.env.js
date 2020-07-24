'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"testGtmc"',
  SERV_ADDR:'"https://iclub-padstest.gtmc.com.cn/api"'
})
