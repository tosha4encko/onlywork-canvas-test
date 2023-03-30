import {ui} from 'ui';
import {debounce} from 'observable';
import {Point, Coord} from 'geoms/point';
import {Rectangle} from 'geoms/rectangle';
import {RectangleCollections} from 'geoms/rectangle-collection';
import {getIntersectionGeom} from 'geom-utils/intersection';
import {find} from '../geom-utils/iterators';

// todo может быть функцией
export class HoverGeomHandler {
  private _clickPoint?: Coord;
  private _activeGeom?: Rectangle;

  constructor(
    private _allGeoms: RectangleCollections,
    private _hoveredGeoms: RectangleCollections,
    geomArea = ui.canvas,
  ) {
    geomArea.addEventListener('mousemove', debounce(this._hoveredListener));
    geomArea.addEventListener('mousedown', ({x, y}) => (this._clickPoint = [x, y]));
    geomArea.addEventListener('mouseup', () => (this._clickPoint = undefined));
  }

  private _hoveredListener = ({x, y}: MouseEvent) => {
    const activeGeom = getIntersectionGeom(this._allGeoms, [x, y]);
    if (this._clickPoint !== undefined && activeGeom === this._activeGeom) {
      return;
    }

    const hoveredRecCollection = this._hoveredGeoms.collection;
    const allRecCollection = this._allGeoms.collection;
    if (this._activeGeom) {
      hoveredRecCollection.delete(this._activeGeom.id);
      this._activeGeom = undefined;
    }
    if (activeGeom instanceof Rectangle) {
      this._activeGeom = activeGeom;
    }
    if (activeGeom instanceof Point) {
      this._activeGeom = find(allRecCollection.iterate(), (rectangle) => rectangle.points.has(activeGeom.id));
    }
    if (this._activeGeom) {
      hoveredRecCollection.append(this._activeGeom);
    }
  };
}
