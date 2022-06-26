import { WebSocketServer } from 'ws';
import { httpServer } from './src/http_server/index.js';

// import Jimp from 'jimp';
import robot from 'robotjs';

const wss = new WebSocketServer({
  port: 8080,
});

const drawCircle = (circle) => {
  const currentPos = circle;

  robot.moveMouse(currentPos.x + currentPos.radius, circle.y);
  robot.mouseToggle('down');

  for (let i = 0; i <= Math.PI * 2; i += 0.01) {
    const x = currentPos.x + currentPos.radius * Math.cos(i);
    const y = currentPos.y + currentPos.radius * Math.sin(i);

    robot.dragMouse(x, y);
  }

  robot.mouseToggle('up');
};

// wss.on('connection', (ws, { encoding: 'utf-8', decodeStrings: false }) => {
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    console.log('received: %s', data);

    const [command, ...args] = data.toString().split(' ');

    console.log('Args ' + args[0]);
    const inputParam1 = +args[0];
    const inputParam2 = +args[1];

    const { x, y } = robot.getMousePos();
    robot.setMouseDelay(100);

    console.log(`x: ${x}`);
    console.log(`y: ${y}`);

    // robot.moveMouse(x + 10, y + 10);
    // robot.mouseToggle('down');
    // robot.dragMouse(x + 10, y + 10);
    // robot.mouseToggle('up');

    switch (command) {
      case 'mouse_up': {
        console.log('HOORAY mouse_up');
        robot.moveMouse(x, y - inputParam1);
        break;
      }
      case 'mouse_down': {
        console.log('HOORAY mouse_down');
        robot.moveMouse(x, y + inputParam1);
        break;
      }
      case 'mouse_right': {
        console.log('HOORAY mouse_right');
        robot.moveMouse(x + inputParam1, y);
        break;
      }
      case 'mouse_left': {
        console.log('HOORAY mouse_left');
        robot.moveMouse(x - inputParam1, y);
        break;
      }
      case 'draw_circle': {
        console.log('HOORAY draw_circle');
        robot.setMouseDelay(5);
        const circle = { x, y, radius: inputParam1 };
        drawCircle(circle);
        break;
      }

      case 'draw_rectangle': {
        console.log('HOORAY draw_rectangle');

        let mouseX = x;
        let mouseY = y;

        console.log('inputParam2 ');
        console.log(inputParam2);

        robot.mouseToggle('down');
        mouseX = mouseX + inputParam2;
        robot.moveMouseSmooth(mouseX, mouseY);
        mouseY = mouseY + inputParam1;
        robot.moveMouseSmooth(mouseX, mouseY);
        mouseX = mouseX - inputParam2;
        robot.moveMouseSmooth(mouseX, mouseY);
        mouseY = mouseY - inputParam1;
        robot.moveMouseSmooth(mouseX, mouseY);
        robot.mouseToggle('up');
        break;
      }

      case 'draw_square': {
        console.log('HOORAY draw_square');

        let mouseX = x;
        let mouseY = y;

        robot.mouseToggle('down');
        mouseX = mouseX + inputParam1;
        robot.moveMouseSmooth(mouseX, mouseY);
        mouseY = mouseY + inputParam1;
        robot.moveMouseSmooth(mouseX, mouseY);
        mouseX = mouseX - inputParam1;
        robot.moveMouseSmooth(mouseX, mouseY);
        mouseY = mouseY - inputParam1;
        robot.moveMouseSmooth(mouseX, mouseY);
        robot.mouseToggle('up');
        break;
      }

      case 'mouse_position': {
        console.log('mouse_position');
        ws.send(`mouse_position ${x},${y}`);
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
