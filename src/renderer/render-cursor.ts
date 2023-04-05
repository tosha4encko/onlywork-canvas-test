import {Coord, RectangleCollections} from 'geoms';
import {ui} from 'ui';
import {debounce} from 'observable';
import {getIntersectionEdges, getNearestPointOnEdge} from 'geom-utils';

const POINT_SIZE = 5;

export class RenderCursor {
  constructor(private _geomCollection: RectangleCollections, private _ui = ui) {
    this._ui.canvas.addEventListener('mousemove', debounce(this._moveListener));
  }

  private _moveListener = ({x, y}: MouseEvent) => {
    const ctx = this._ui.tempPointCanvas.getContext('2d');
    ctx.clearRect(0, 0, this._ui.canvas.width, this._ui.canvas.height);

    for (const rectangle of this._geomCollection.collection.iterate()) {
      const edge = getIntersectionEdges(rectangle, [x, y]);
      if (edge !== undefined) {
        const [p1, p2] = edge;
        const pointOnEdge = getNearestPointOnEdge([p1.coord, p2.coord], [x, y]);
        this._pointRender(pointOnEdge);

        return;
      }
    }
  };

  private _pointRender = ([x, y]: Coord) => {
    const ctx = this._ui.tempPointCanvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(x, y, POINT_SIZE, 0, 2 * Math.PI, true);
    ctx.fill();
  };
}
