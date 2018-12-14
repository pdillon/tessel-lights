const Koa = require('koa');
const http = require('http');
const socketIO = require('socket.io');
const serve = require('koa-static');
const {testPinToggle, cycle} = require('./middleware');
const {midi} = require('./socketBindings');
const Tessel = require('./Tessel');

(async function() {
  // Turn on all pins on start up
  await Tessel.portWrite({on: true, port: 'A'});

  const app = new Koa();
  const server = http.createServer(app.callback());
  const io = socketIO(server);

  io.on('connection', socket => {
    midi.bind(socket);
  });

  app
    .use(testPinToggle)
    .use(cycle)
    .use(serve(__dirname + '/static'));

  await server.listen(3000);
  console.log('Service started');
})();
