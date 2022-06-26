import { WebSocketServer } from 'ws';
import { httpServer } from './src/http_server/index.js';

// import Jimp from 'jimp';
import robot from 'robotjs';

const wss = new WebSocketServer({
  port: 8080,
});

// wss.on('connection', (ws, { encoding: 'utf-8', decodeStrings: false }) => {
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('received: %s', data);

    const [command, ...args] = data.toString().split(' ');

    console.log('Args ' + args[0]);
    const mouseOffset = +args[0];

    const { x, y } = robot.getMousePos();
    ws.send(`mouse_position ${x},${y}`);

    console.log(`x: ${x}`);
    console.log(`y: ${y}`);

    // robot.moveMouse(x + 10, y + 10);
    // robot.mouseToggle('down');
    // robot.dragMouse(x + 10, y + 10);
    // robot.mouseToggle('up');

    switch (command) {
      case 'mouse_up': {
        console.log('HOORAY mouse_up');
        robot.moveMouse(x, y - mouseOffset);
        break;
      }
      case 'mouse_down': {
        console.log('HOORAY mouse_down');
        robot.moveMouse(x, y + mouseOffset);
        break;
      }
      case 'mouse_right': {
        console.log('HOORAY mouse_right');
        robot.moveMouse(x + mouseOffset, y);
        break;
      }
      case 'mouse_left': {
        console.log('HOORAY mouse_left');
        robot.moveMouse(x - mouseOffset, y);
        break;
      }
      case 'draw_circle': {
        console.log('HOORAY draw_circle');
        break;
      }
      case 'draw_rectangle': {
        console.log('HOORAY draw_rectangle');
        break;
      }
      case 'draw_rectangle': {
        console.log('HOORAY draw_rectangle');
        break;
      }
      case 'mouse_position': {
        console.log('mouse_position');
        break;
      }

      default: {
        // printErrorMessage();
        break;
      }
    }
  });

  ws.send('something');

  ws.on('close', () => {
    console.log('closews');
    ws.send();
  });

  ws.on('error', () => {
    console.log('error');
  });
});

wss.on('error', () => {
  console.log('error');
});

wss.on('close', () => {
  process.stdout.write('Closing websocket...\n');
  wss.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  process.stdout.write('Closing websocket...\n');
  wss.close();
  process.exit(0);
});

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
