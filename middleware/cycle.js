const Tessel = require('../Tessel');
let cycleEnabled = true;
let cycleFunc = null;
let cycleTimerHandle = null;

module.exports = async (ctx, next) => {
  if (ctx.path === '/cycle') {
    const {pinOrder = '0,1,2,3,4,5,6,7', stop, timer = 5} = ctx.query;

    if (stop === 'true') {
      cycleEnabled = false;
      cycleFunc = null;
      return;
    }

    cycleFunc = async () => {
      cycleEnabled = true;
      await cyclePins(pinOrder.split(','));
    };

    cycleTimerHandle = setInterval(cycleFunc, parseInt(timer) * (1000 * 60));
    ctx.body = 'Cylcle enabled';
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
  intervalSteps = [50, 100, 250, 500, 750, 500, 250, 100],
  intervalSize = 3000
) {
  let stepCount = 0;
  while (cycleEnabled) {
    const interval = intervalSteps[stepCount % intervalSteps.length];
    for (let i = 0; i < intervalSize / interval; ++i) {
      for (const pin of pinOrder) {
        await Tessel.pinWrite({pin, on: true});
        await sleep(interval);
        await Tessel.pinWrite({pin, on: false});
      }
    }
    ++stepCount;
  }
  await Tessel.portWrite({on: true});
}
