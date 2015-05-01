var exports = {};

exports.server = ['connect:server'];

exports.build = ['concat:dist', 'copy:dist'];

module.exports = exports;