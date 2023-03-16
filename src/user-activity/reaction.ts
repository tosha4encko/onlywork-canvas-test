import {Rectangle} from 'geoms/Rectangle';
import {Point} from 'geoms/Point';
import {HoveredAction, MoveAction, ActionsWithGeom} from './actions-with-geom';
import {Geometry} from 'geoms/geometry';
import {ReactiveCollection} from 'reactive-colection';

export class Reactions {
  readonly hoveredGeomCollection = new ReactiveCollection<Geometry>();
  constructor(private _userActions: ActionsWithGeom) {
    this._userActions.hoveredSubscribe(this._hoverGeometry);
    this._userActions.moveSubscribe(this._pointMove);
    this._userActions.moveSubscribe(this._rectangleMove);
  }

  private _hoverGeometry = ({geom, hovered}: HoveredAction) => {
    if (hovered) {
      this.hoveredGeomCollection.append(geom);
    } else {
      this.hoveredGeomCollection.delete(geom);
    }
  };

  private _pointMove = ({geom, moveCoord}: MoveAction) => {
    debugger;
    if (geom instanceof Point) {
      const [xM, yM] = moveCoord;
      const [x0, y0] = geom.coord;
      geom.coord = [x0 - xM, y0 - yM];
    }
  };

  private _rectangleMove = ({geom, moveCoord}: MoveAction) => {
    if (geom instanceof Rectangle) {
      const [xM, yM] = moveCoord;
      for (const point of geom.points.iterate()) {
        const [x0, y0] = point.coord;
        point.coord = [x0 - xM, y0 - yM];
      }
    }
  };
}
