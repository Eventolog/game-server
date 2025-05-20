const { v4: uuidv4 } = require('uuid');

function createUUID() {
  return uuidv4();
}

module.exports = { createUUID };
