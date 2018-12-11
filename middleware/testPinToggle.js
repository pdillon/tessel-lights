const Tessel = require('../Tessel');

module.exports = async (ctx, next) => {
  if (ctx.path === '/test-toggle') {
    const {pin = '0', power = 'on'} = ctx.query;
    await Tessel.pinWrite({pin, on: power === 'on'});
    ctx.body = `Toggled pin ${pin} ${power}`;
    return;
  }
  await next();
};
