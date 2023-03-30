import {Geometry} from 'geoms/geometry';
import {Coord} from 'geoms/Point';
import {equelPoints, getCenter, sign} from 'geom-utils/math';
import {Rectangle} from 'geoms/rectangle';
import {Point} from 'geoms/point';

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
    const isOneSide = (edge: [Coord, Coord]) => sign([x, y], edge) === sign(center, edge);

    return ever(edgeIterator(rectangle), isOneSide);
  });
}
