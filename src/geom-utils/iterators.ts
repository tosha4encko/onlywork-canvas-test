import {Rectangle, RectangleCollections, Coord, Point, Geometry} from 'geoms';

export function* pointIterator(geom: Geometry): IterableIterator<Point> {
  if (geom instanceof Rectangle) {
    for (let point of geom.points.iterate()) {
      yield point;
    }
  } else if (geom instanceof RectangleCollections) {
    for (let rectangle of geom.collection.iterate()) {
      yield* pointIterator(rectangle);
    }
  } else if (geom instanceof Point) {
    yield geom;
  }
}

export function* edgeIterator(geom: Geometry): IterableIterator<[Coord, Coord]> {
  if (geom instanceof Rectangle) {
    const points = [...geom.points.iterate()];
    for (let i = 1; i < points.length; i++) {
      yield [points[i - 1].coord, points[i].coord];
    }
    yield [points[points.length - 1].coord, points[0].coord];
  } else if (geom instanceof RectangleCollections) {
    for (let rectangle of geom.collection.iterate()) {
      yield* edgeIterator(rectangle);
    }
  }
}

export function* rectangleIterator(geom: Geometry): IterableIterator<Rectangle> {
  if (geom instanceof Rectangle) {
    yield geom;
  } else if (geom instanceof RectangleCollections) {
    for (let rectangle of geom.collection.iterate()) {
      yield rectangle;
    }
  }
}

export function find<T>(generator: IterableIterator<T>, predicat: (value: T) => boolean): T | undefined {
  for (let item of generator) {
    if (predicat(item)) {
      return item;
    }
  }
}
export function* filter<T>(generator: IterableIterator<T>, predicat: (value: T) => boolean) {
  for (let item of generator) {
    if (predicat(item)) {
      yield item;
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

export function* map<T, K>(generator: IterableIterator<T>, cb: (value: T) => K) {
  for (let item of generator) {
    yield cb(item);
  }
}

export function* forEach<T>(generator: IterableIterator<T>, cb: (value: T) => void) {
  for (let item of generator) {
    cb(item);
  }
}
