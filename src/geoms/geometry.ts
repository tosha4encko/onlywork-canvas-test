export interface IGeometry {
  id: number;
}

let lastIndex = 0;
export abstract class Geometry<T extends IGeometry> {
  readonly id = lastIndex++; // todo можно удалить?
  abstract snapshot(): T;
}
