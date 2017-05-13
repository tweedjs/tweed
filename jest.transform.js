const config = require('tweed-babel-config')

config.presets[0][1].modules = 'commonjs'

module.exports = require('babel-jest').createTransformer(config)
