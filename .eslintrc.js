const config = require('@lobehub/lint').eslint;

config.extends.push('plugin:@next/next/recommended');

config.rules = {};


module.exports = config;
