const Koa = require('koa');
const http = require('http');
const socketIO = require('socket.io');
const serve = require('koa-static');
const {testPinToggle} = require('./middleware');
const {midi} = require('./socketBindings');

const app = new Koa();
const server = http.createServer(app.callback());
const io = socketIO(server);

io.on('connection', socket => {
  midi.bind(socket);
});

app.use(testPinToggle).use(serve(__dirname + '/static'));

server.listen(3000);
