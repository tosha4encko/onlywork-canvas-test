// todo объединить с UserActions?
import {RectangleCollections} from './geoms/rectangle-collection';
import {Rectangle} from './geoms/Rectangle';
import {Point} from './geoms/Point';
import {HoveredAction, MoveAction, SelectAction, UserActions} from './user-actions';

export class Reactions {
  constructor(private _geomCollection: RectangleCollections, private _userActions = new UserActions(_geomCollection)) {
    // this._userActions.hoveredSubscribe(this._hoverGeometry);
    this._userActions.moveSubscribe(this._pointMove);
    this._userActions.moveSubscribe(this._rectangleMove);
  }

  // private _hoverGeometry = ({geom, hovered}: HoveredAction) => {
  //   geom.hovered = hovered;
  // };
  //
  // private _selectGeom = ({geom, selected}: SelectAction) => {
  //   geom.selected = selected;
  // };

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

  private _pointCheck = (point: Point) => {
    //todo сделать коллекции объектом
  };

  private _rectanglesCheck = (point: Rectangle) => {
    //todo
  };
}
