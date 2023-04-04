import {Geometry, Rectangle, RectangleCollections} from 'geoms';
import {debounce} from 'observable';
import {ReactiveCollectionFires} from 'reactive-colection';
import {ui} from '../ui';
import {forEach, getIntersectionGeom} from '../geom-utils';

export interface IRecoverableSnapshot {
  id: number;
  recover(): void;
}

interface HistoryNode {
  recover: () => void;
  next: HistoryNode | null;
  prev: HistoryNode | null;
}

export class SnapshotCaretaker {
  private _currentNode: HistoryNode | null;
  private _activeGeom?: Geometry;
  private _mute = false;
  private _needSnapshot = false;

  constructor(private _geomCollection: RectangleCollections, reactionArea = ui.canvas) {
    reactionArea.addEventListener('mousedown', this._mouseDownHandler);
    reactionArea.addEventListener('mouseup', this._mouseUpHandler);

    // todo garbage collect
    this.add(this._geomCollection.snapshot());
    this._geomCollection.collection.subscribe(() => this.add(this._geomCollection.snapshot()));

    forEach(this._geomCollection.collection.iterate(), this._subscribeToRectangle);
    this._geomCollection.collection.subscribe(({type, objId}) => {
      // todo что-то делать с другими экшенами
      if (type === ReactiveCollectionFires.Append) {
        const rectangle = this._geomCollection.collection.get(objId);
        this._subscribeToRectangle(rectangle);
      }
    });
  }

  add(snapshot: IRecoverableSnapshot) {
    if (!this._mute) {
      const newNode: HistoryNode = {recover: snapshot.recover, prev: this._currentNode, next: null};
      this._currentNode && (this._currentNode.next = newNode);
      this._currentNode = newNode;
    }
  }

  next() {
    if (this._currentNode?.next) {
      this._mute = true;
      setTimeout(() => (this._mute = false), 100);

      this._currentNode = this._currentNode.next;
      this._currentNode.recover();
    }
  }

  prev() {
    if (this._currentNode?.prev) {
      this._mute = true;
      setTimeout(() => (this._mute = false), 100);

      this._currentNode = this._currentNode.prev;
      this._currentNode.recover();
    }
  }

  private _mouseDownHandler = ({x, y}: MouseEvent) => {
    this._activeGeom = getIntersectionGeom(this._geomCollection, [x, y]);
  };

  private _mouseUpHandler = () => {
    if (this._activeGeom !== undefined && this._needSnapshot) {
      this.add(this._geomCollection.snapshot());
      this._needSnapshot = false;
    }

    this._activeGeom = undefined;
  };

  private _subscribeToRectangle = (rectangle: Rectangle) => {
    rectangle.points.subscribe(debounce(() => this.add(rectangle.snapshot())));
    for (const point of rectangle.points.iterate()) {
      point.subscribe(debounce(() => (this._needSnapshot = true)));
    }
  };
}
