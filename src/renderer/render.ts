import {ui} from 'ui';
import {RectangleCollections} from 'geoms';
import {ReactiveCollectionChangeEvent, ReactiveCollectionFires} from 'reactive-colection';
import {RenderCollection} from './render-collection';

export class Render {
  private _sleepingGeoms: RectangleCollections;
  constructor(
    private _allRectangles: RectangleCollections,
    private _hoveredGeoms: RectangleCollections,
    private _ui = ui,
  ) {
    const allRectangles = this._allRectangles.collection;
    const hoveredRectangles = this._hoveredGeoms.collection;
    this._sleepingGeoms = new RectangleCollections([...allRectangles.iterate()]);

    allRectangles.subscribe(this._allRectangleChangeHandler);
    hoveredRectangles.subscribe(this._hoveredRectangleChangeHandler);

    new RenderCollection(this._hoveredGeoms, 'orange', this._ui.dirtyCanvas);
    new RenderCollection(this._sleepingGeoms, 'blue', this._ui.canvas);
  }

  private _allRectangleChangeHandler = ({type, objId}: ReactiveCollectionChangeEvent) => {
    const allRectangles = this._allRectangles.collection;
    const hoveredRectangles = this._hoveredGeoms.collection;
    const sleepingRectangle = this._sleepingGeoms.collection;

    switch (type) {
      case ReactiveCollectionFires.Append:
        if (!hoveredRectangles.has(objId)) {
          sleepingRectangle.append(allRectangles.get(objId));
        }
        break;
      case ReactiveCollectionFires.Delete:
        sleepingRectangle.delete(objId);
        break;
      case ReactiveCollectionFires.Clear:
        sleepingRectangle.clear();
        break;
    }
  };

  private _hoveredRectangleChangeHandler = ({type, objId}: ReactiveCollectionChangeEvent) => {
    const allRectangles = this._allRectangles.collection;
    const sleepingRectangle = this._sleepingGeoms.collection;

    switch (type) {
      case ReactiveCollectionFires.Append:
        sleepingRectangle.delete(objId);
        break;
      case ReactiveCollectionFires.Delete:
        sleepingRectangle.append(allRectangles.get(objId));
        break;
    }
  };
}
