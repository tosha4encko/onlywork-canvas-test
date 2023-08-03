import {ReactiveCollection} from 'reactive-colection';
import {Geometry, Coord, Point} from '.';

interface IRectangleSnapshot {
  id: number;
  points: Point[];
  recover(): void;
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

  snapshot(): IRectangleSnapshot {
    const points = [...this.points.iterate()];
    const snapshots = points.map(point => point.snapshot())

    return {
      id: this.id,
      points: points,
      recover: () => {
        this.points.clear();
        this.points.append(...points);
        snapshots.forEach(snapshot => snapshot.recover())
      },
    };
  }
}
