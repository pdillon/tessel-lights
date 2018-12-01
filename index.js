const tessel = require('tessel');
const Koa = require('koa');
const http = require('http');
const socketIO = require('socket.io');
const serve = require('koa-static');
const {promisify} = require('util');

const asyncPinWrites = tessel.port.A.pin.map(p => promisify(p.write.bind(p)));

const togglePin = async (pinNumber, onOff) => {
  await asyncPinWrites[pinNumber](onOff);
};

const app = new Koa();
const server = http.createServer(app.callback());
const io = socketIO(server);

io.on('connection', socket => {
  socket
    .on('note-on', async note => {
      const pin = note - 60 / 2; // Map to whole notes starting at middle C
      await togglePin(pin, 1);
    })
    .on('note-off', async note => {
      const pin = note - 60 / 2;
      await togglePin(pin, 0);
    });
});

app
  .use(async (ctx, next) => {
    if (ctx.path === '/test-toggle') {
      const {pin = '0', power = 'on'} = ctx;

      await togglePin(pin, power == 'on' ? 1 : 0);
      ctx.body = `Toggled pin ${pin} ${power}`;
      return;
    }
    await next();
  })
  .use(serve(__dirname + '/static'));

server.listen(3000);
