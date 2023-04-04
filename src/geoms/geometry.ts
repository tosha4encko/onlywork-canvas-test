import {IRecoverableSnapshot} from 'user-activity/snapshots-caretaker';

let lastIndex = 0;
export abstract class Geometry {
  readonly id = lastIndex++;
  abstract snapshot(): IRecoverableSnapshot;
}
