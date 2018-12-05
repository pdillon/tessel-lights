const tessel = require('tessel');
const Koa = require('koa');
const http = require('http');
const socketIO = require('socket.io');
const serve = require('koa-static');
const {promisify} = require('util');

const DEFAULT_PORT = 'A';
const START_PIN = process.env.START_PIN || 2;

const KEY_MAP = [
  60, // C
  62, // D
  64, // E
  65, // F
  67, // G
  69, // A
  71
];

const asyncPinWrites = tessel.port[DEFAULT_PORT].pin.map(p =>
  promisify(p.write.bind(p))
);

const mapNoteToPin = note => {
  const pinIndex = KEY_MAP.indexOf(note);
  if (pinIndex !== -1) {
    return START_PIN + pinIndex;
  } else {
    return -1;
  }
};

const togglePinFromNote = async (note, onOff) => {
  const pinNumber = mapNoteToPin(note);
  if (pinNumber === -1) {
    return;
  }

  await asyncPinWrites[pinNumber](onOff);
};

const app = new Koa();
const server = http.createServer(app.callback());
const io = socketIO(server);

io.on('connection', socket => {
  socket
    .on('note-on', async note => {
      await togglePinFromNote(note, 0);
    })
    .on('note-off', async note => {
      await togglePinFromNote(note, 1);
    });
});

app
  .use(async (ctx, next) => {
    if (ctx.path === '/test-toggle') {
      const {pin = '0', power = 'on'} = ctx.query;
      await asyncPinWrites[pin](power == 'on' ? 1 : 0);
      ctx.body = `Toggled pin ${pin} ${power}`;
      return;
    }
    await next();
  })
  .use(serve(__dirname + '/static'));

server.listen(3000);
