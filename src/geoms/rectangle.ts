import {IGeometry, Geometry} from './geometry';
import {Coord, Point} from './Point';
import {ReactiveCollection} from '../reactive-colection';

interface IRectangle extends IGeometry {
  points: Point[];
}

export class Rectangle extends Geometry {
  readonly points = new ReactiveCollection<Point>();

  constructor(points: Coord[]);
  constructor(points: Point[]);
  constructor(points: Point[] | Coord[]) {
    super();

    points.forEach((point) => {
      if (point instanceof Point) {
        this.points.append(point);
      } else {
        this.points.append(new Point([...point]));
      }
    });
  }

  snapshot(): IRectangle {
    return {
      id: this.id,
      points: Array.from(this.points.iterate()),
    };
  }
}
