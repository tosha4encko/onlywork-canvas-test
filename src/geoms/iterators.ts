import {Rectangle} from './Rectangle';
import {RectangleCollections} from './RectangleCollection';
import {Point} from './Point';

export function pointIterator(rectangle: Rectangle): IterableIterator<Point>;
export function pointIterator(collection: RectangleCollections): IterableIterator<Point>;
export function* pointIterator(arg: Rectangle | RectangleCollections): IterableIterator<Point> {
  if (arg instanceof Rectangle) {
    for (let point of arg.points) {
      yield point;
    }
  } else {
    for (let rectangle of arg.collection) {
      yield* pointIterator(rectangle);
    }
  }
}

export function edgeIterator(rectangle: Rectangle): IterableIterator<[Point, Point]>;
export function edgeIterator(collection: RectangleCollections): IterableIterator<[Point, Point]>;
export function* edgeIterator(arg: Rectangle | RectangleCollections): IterableIterator<[Point, Point]> {
  if (arg instanceof Rectangle) {
    const points = arg.points;
    for (let i = 1; i < points.length; i++) {
      yield [points[i - 1], points[i]];
    }
  } else {
    for (let rectangle of arg.collection) {
      yield* edgeIterator(rectangle);
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
