const { config, preset } = require('conartist');

module.exports = config(preset.babel(), preset.base(), preset.jest());
