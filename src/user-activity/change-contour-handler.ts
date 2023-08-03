import {Point, Rectangle, RectangleCollections} from 'geoms';
import {ui} from 'ui';
import {getIntersectionEdges, getIntersectionPoint, getNearestPointOnEdge} from 'geom-utils';
import {SnapshotCaretaker} from './snapshots-caretaker';

export class ChangeContourHandler {
  constructor(
    private _geomCollection: RectangleCollections, 
    private _snapshotCaretaker: SnapshotCaretaker,
    private _reactionArea = ui.canvas
  ) {
    this._reactionArea.addEventListener('mousedown', this._mouseDownHandler);
  }

  private _mouseDownHandler = ({x, y}: MouseEvent) => {
    const intersectionPoint = getIntersectionPoint(this._geomCollection, [x, y]);
    if (intersectionPoint) {
      return;
    }

    for (const rectangle of this._geomCollection.collection.iterate()) {
      const edge = getIntersectionEdges(rectangle, [x, y]);
      if (edge === undefined) {
        continue;
      }

      const [p1, p2] = edge;
      const pointForPushOnEdge = getNearestPointOnEdge([p1.coord, p2.coord], [x, y]);
      this._pushPointIntoEdge(new Point(pointForPushOnEdge), edge, rectangle);
      this._snapshotCaretaker.record()

      return;
    }
  };

  // мутируем rect
  private _pushPointIntoEdge(p: Point, edge: [Point, Point], rect: Rectangle) {
    const points = [...rect.points.iterate()];
    rect.points.clear();

    for (let i = 0; i < points.length; i++) {
      const currentPoint = points[i];
      const nextPoint = points[(i + 1) % points.length];
      rect.points.append(currentPoint);
      if (edge.includes(currentPoint) && edge.includes(nextPoint)) {
        rect.points.append(p);
      }
    }
  }
}
