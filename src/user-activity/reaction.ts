import {Rectangle} from 'geoms/Rectangle';
import {Point} from 'geoms/Point';
import {MoveAction, ActionsWithGeom} from './actions-with-geom';

export class Reactions {
  constructor(private _userActions: ActionsWithGeom) {
    this._userActions.moveSubscribe(this._pointMove);
    this._userActions.moveSubscribe(this._rectangleMove);
  }

  private _pointMove = ({geom, moveCoord}: MoveAction) => {
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
