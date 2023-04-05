import {Geometry, Coord, Rectangle, Point} from 'geoms';
import {dist, equelPoints, getCenter, sign} from 'geom-utils';

import {edgeIterator, ever, find, pointIterator, rectangleIterator} from './iterators';

export function getIntersectionGeom(geom: Geometry, [x, y]: Coord): Rectangle | Point | undefined {
  const intersectedPoint = getIntersectionPoint(geom, [x, y]);
  if (intersectedPoint) {
    return intersectedPoint;
  }

  const intersectedRectangle = getIntersectionRectangle(geom, [x, y]);
  if (intersectedRectangle) {
    return intersectedRectangle;
  }
}

export function getIntersectionPoint(geom: Geometry, [x, y]: Coord) {
  return find(pointIterator(geom), ({coord}) => equelPoints(coord, [x, y]));
}

export function getIntersectionRectangle<T extends Geometry>(geom: T, [x, y]: Coord): Rectangle | undefined {
  return find(rectangleIterator(geom), (rectangle) => {
    const center = getCenter(rectangle);
    const isOneSide = ([p1, p2]: [Point, Point]) =>
      sign([x, y], [p1.coord, p2.coord]) === sign(center, [p1.coord, p2.coord]);

    return ever(edgeIterator(rectangle), isOneSide);
  });
}

const EPS = 1;
export function getIntersectionEdges(rect: Rectangle, p0: Coord, eps = EPS): [Point, Point] | undefined {
  for (const [p1, p2] of edgeIterator(rect)) {
    if (dist(p0, p1.coord) + dist(p0, p2.coord) - dist(p1.coord, p2.coord) < eps) {
      return [p1, p2];
    }
  }
}

export function getNearestPointOnEdge([p1, p2]: [Coord, Coord], [x0, y0]: Coord): Coord | undefined {
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const m = x2 - x1;
  const p = y2 - y1;
  const tC = m * x0 + p * y0 - m * x1 - p * y1;
  const tZ = m * m + p * p;
  const t = tC / tZ;

  const xR = m * t + x1;
  const yR = p * t + y1;

  return [xR, yR];
}
