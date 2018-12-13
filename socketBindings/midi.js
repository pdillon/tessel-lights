const Tessel = require('../Tessel');

const START_PIN = process.env.START_PIN || 0;
const MAX_PIN = 7;

const KEY_MAP = [
  60, // C
  62, // D
  64, // E
  65, // F
  67, // G
  69, // A
  71, // B
  72 // C
];

async function togglePinFromNote(note, on) {
  const pinIndex = KEY_MAP.indexOf(note);
  if (pinIndex === -1) {
    console.log(`Pin is not mapped for note ${note}`);
    return;
  }
  const pinNumber = pinIndex + START_PIN;
  if (pinNumber > MAX_PIN) {
    console.log(`Mapping to pin number ${pinNumber} exceed pin count`);
  }

  await Tessel.pinWrite({pin: pinNumber, on});
}

module.exports = {
  bind: socket => {
    socket
      .on('note-on', async note => {
        await togglePinFromNote(note, 0);
      })
      .on('note-off', async note => {
        await togglePinFromNote(note, 1);
      });
  }
};
