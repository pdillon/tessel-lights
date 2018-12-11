const tessel = require('tessel');
const {promisify} = require('util');

const {A: portA, B: portB} = tessel.port;

const asyncPinWrites = {
  A: portA.pin.map(p => promisify(p.write.bind(p))),
  B: portB.pin.map(p => promisify(p.write.bind(p)))
};

class Tessel {
  static async pinWrite({pin, on = true, port = 'A'}) {
    return await asyncPinWrites[port][pin](on);
  }
}

module.exports = Tessel;
