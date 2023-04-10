import {Geometry, Coord, Rectangle, Point} from 'geoms';
import {dist, equelPoints, map} from 'geom-utils';

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
    return pointInPolygon([x,y], [...map(rectangle.points.iterate(), point => point.coord)])
  });
}


// chatGPT code
function pointInPolygon(point: Coord, polygon: Coord[]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];

    if (isPointOnBoundary(y, pi, pj)) {
      return true;
    }
    if (isPointOnEdge(x, y, pi, pj)) {
      inside = !inside;
    }
  }

  return inside;
}

function isPointOnBoundary(y: number, pi: Coord, pj: Coord): boolean {
  return isHorizontalEdge(y, pi, pj) && isXInRange(pi, pj, y);
}

function isPointOnEdge(x: number, y: number, pi: Coord, pj: Coord): boolean {
  return isYInRange(y, pi, pj) && isXLeftOfIntersection(x, y, pi, pj);
}

function isHorizontalEdge(y: number, pi: Coord, pj: Coord): boolean {
  return pi[1] === y || pj[1] === y;
}

function isXInRange(pi: Coord, pj: Coord, y: number): boolean {
  const [x1, y1] = pi;
  const [x2, y2] = pj;
  const x = ((y - y1) * (x2 - x1)) / (y2 - y1) + x1;
  return x1 < x2 ? x1 <= x && x <= x2 : x2 <= x && x <= x1;
}

function isYInRange(y: number, pi: Coord, pj: Coord): boolean {
  return (pi[1] <= y && y < pj[1]) || (pj[1] <= y && y < pi[1]);
}

function isXLeftOfIntersection(x: number, y: number, pi: Coord, pj: Coord): boolean {
  const [x1, y1] = pi;
  const [x2, y2] = pj;
  return x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
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
