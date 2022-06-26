import robot from 'robotjs';
import { createWebSocketStream, WebSocketServer } from 'ws';
import { drawCircle } from './drawCircle';
import { drawRectangle } from './drawRectangle';
import { printScreen } from './printScreen';

import { httpServer } from './src/http_server/index.js';

const wss = new WebSocketServer({
  port: 8080,
});

wss.on('connection', (ws) => {
  const dulpex = createWebSocketStream(ws, { encoding: 'utf8' });

  dulpex.on('data', (chunk) => {
    console.log('received: %s', chunk);

    const [command, ...args] = chunk.toString().split(' ');

    // @ts-ignore
    const inputParam1 = +args[0];

    // @ts-ignore
    const inputParam2 = +args[1];

    const { x, y } = robot.getMousePos();
    robot.setMouseDelay(100);

    switch (command) {
      case 'mouse_position': {
        console.log('mouse_position');
        ws.send(`mouse_position ${x},${y}`);
        break;
      }
      case 'mouse_up': {
        console.log('HOORAY mouse_up');
        robot.moveMouse(x, y - inputParam1);
        ws.send('mouse_up');
        break;
      }
      case 'mouse_down': {
        console.log('HOORAY mouse_down');
        robot.moveMouse(x, y + inputParam1);
        ws.send('mouse_down');
        break;
      }
      case 'mouse_right': {
        console.log('HOORAY mouse_right');
        robot.moveMouse(x + inputParam1, y);
        ws.send('mouse_right');
        break;
      }
      case 'mouse_left': {
        console.log('HOORAY mouse_left');
        robot.moveMouse(x - inputParam1, y);
        ws.send('mouse_left');
        break;
      }
      case 'draw_circle': {
        console.log('HOORAY draw_circle');
        robot.setMouseDelay(5);
        const circle = { x, y, radius: inputParam1 };
        drawCircle(circle);
        ws.send('draw_circle');
        break;
      }
      case 'draw_rectangle': {
        console.log('HOORAY draw_rectangle');
        drawRectangle(x, y, inputParam1, inputParam2);
        ws.send('draw_rectangle');
        break;
      }
      case 'draw_square': {
        console.log('HOORAY draw_square');
        drawRectangle(x, y, inputParam1, inputParam1);
        ws.send('draw_square');
        break;
      }
      case 'prnt_scrn': {
        console.log('prnt_scrn');
        ws.send(`prnt_scrn`);
        const res = printScreen();

        res.then((result) => {
          // console.log(result);
          ws.send(`prnt_scrn ${result}`);
        });
        break;
      }
      default: {
        break;
      }
    }
  });

  // ws.send('something');

  ws.on('close', () => {
    console.log('closews');
    ws.send('close');
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
