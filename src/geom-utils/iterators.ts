import {Rectangle} from 'geoms/Rectangle';
import {RectangleCollections} from 'geoms/RectangleCollection';
import {Coord, Point} from 'geoms/Point';
import {IReactiveGeometry} from 'geoms/ReactiveGeometry';

export function* pointIterator(geom: IReactiveGeometry): IterableIterator<Point> {
  if (geom instanceof Rectangle) {
    for (let point of geom.points) {
      yield point;
    }
  } else if (geom instanceof RectangleCollections) {
    for (let rectangle of geom.collection) {
      yield* pointIterator(rectangle);
    }
  } else if (geom instanceof Point) {
    yield geom;
  }
}

export function* edgeIterator(geom: IReactiveGeometry): IterableIterator<[Coord, Coord]> {
  if (geom instanceof Rectangle) {
    const points = geom.points;
    for (let i = 1; i < points.length; i++) {
      yield [points[i - 1].coord, points[i].coord];
    }
    yield [points[points.length - 1].coord, points[0].coord];
  } else if (geom instanceof RectangleCollections) {
    for (let rectangle of geom.collection) {
      yield* edgeIterator(rectangle);
    }
  }
}

export function* rectangleIterator(geom: IReactiveGeometry): IterableIterator<Rectangle> {
  if (geom instanceof Rectangle) {
    yield geom;
  } else if (geom instanceof RectangleCollections) {
    for (let rectangle of geom.collection) {
      yield rectangle;
    }
  }
}

// todo затащить loadash?
export function find<T>(generator: IterableIterator<T>, predicat: (value: T) => boolean) {
  for (let item of generator) {
    if (predicat(item)) {
      return item;
    }
  }
}

export function ever<T>(generator: IterableIterator<T>, predicat: (value: T) => boolean) {
  for (let item of generator) {
    if (!predicat(item)) {
      return false;
    }
  }
  return true;
}
