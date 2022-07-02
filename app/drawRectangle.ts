import robot from 'robotjs';

export const drawRectangle = (
  x: any,
  y: any,
  inputParam1: any,
  inputParam2: any
) => {
  let mouseX = x;
  let mouseY = y;

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
};
