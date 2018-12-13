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

  /**
   * Write to all pins for a single port
   * @param {on: boolean, port: ['A', 'B']} options
   */
  static async portWrite({on = true, port = 'A'}) {
    for (const writeFunc of asyncPinWrites[port]) {
      await writeFunc(on);
    }
  }
}

module.exports = Tessel;
