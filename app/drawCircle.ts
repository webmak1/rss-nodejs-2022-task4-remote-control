import robot from 'robotjs';

export const drawCircle = (circle: any) => {
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
