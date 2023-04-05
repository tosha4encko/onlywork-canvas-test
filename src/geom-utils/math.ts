import {Rectangle, Coord} from 'geoms';

import {pointIterator} from './iterators';

const EPS = 7;
export function equelPoints([x1, y1]: Coord, [x2, y2]: Coord) {
  return Math.abs(x1 - x2) < EPS && Math.abs(y1 - y2) < EPS;
}

export function getCenter(rectangle: Rectangle): Coord {
  let res: Coord = [0, 0];
  for (let point of pointIterator(rectangle)) {
    res[0] += point.coord[0];
    res[1] += point.coord[1];
  }

  res[0] /= 4;
  res[1] /= 4;

  return res;
}

export function sign([x0, y0]: Coord, [[x1, y1], [x2, y2]]: [Coord, Coord]) {
  return Math.sign((y0 - y1) / (y2 - y1) - (x0 - x1) / (x2 - x1));
}

export function dist([x1, y1]: Coord, [x2, y2]: Coord) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
