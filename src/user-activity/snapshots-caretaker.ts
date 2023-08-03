import {RectangleCollections} from 'geoms';

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
  private _mute = false;

  constructor(private _geomCollection: RectangleCollections) {
    this.record();
  }

  record() {
    if (!this._mute) {
      const snapshot = this._geomCollection.snapshot();
      const newNode: HistoryNode = {recover: snapshot.recover, prev: this._currentNode, next: null};
      this._currentNode && (this._currentNode.next = newNode);
      this._currentNode = newNode;

      this._mute = true;
      setTimeout(() => (this._mute = false), 100);
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
}
