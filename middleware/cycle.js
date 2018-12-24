/**
 * Cycle the pins on/off at various intervals
 */
const Tessel = require('../Tessel');
let cycleFunc = null;
let cycleTimerHandle = null;

module.exports = async (ctx, next) => {
  if (ctx.path === '/cycle') {
    const {pinOrder = '0,1,2,3,4,5,6,7', stop, timer = 5} = ctx.query;

    if (stop === 'true') {
      cycleFunc = null;
      clearTimeout(cycleTimerHandle);
      cycleTimerHandle = null;
      return;
    }
    if (cycleFunc) {
      return;
    }

    cycleFunc = async () => {
      await cyclePins(pinOrder.split(','));
      cycleTimerHandle = setTimeout(cycleFunc, parseInt(timer) * (1000 * 60));
    };

    await cycleFunc();

    ctx.body = 'Cycle enabled';
  }
  await next();
};

const sleep = async interval => {
  return new Promise(resolve => {
    setTimeout(resolve, interval);
  });
};

async function cyclePins(
  pinOrder,
  intervalSteps = [250, 100],
  intervalSize = 1000
) {
  for (const interval of intervalSteps) {
    for (let i = 0; i < intervalSize / interval; ++i) {
      for (const pin of pinOrder) {
        await Tessel.pinWrite({pin, on: true});
        await sleep(interval);
        await Tessel.pinWrite({pin, on: false});
      }
    }
  }
  await Tessel.portWrite({on: true});
}
