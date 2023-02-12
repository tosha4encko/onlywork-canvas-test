import {debounce, Observable} from '../observable';

// todo придумать нормальное имя
export interface IReactiveGeometry {
  selected: boolean;
  hovered: boolean;
}

let lastIndex = 0;
export abstract class ReactiveGeometry<T extends IReactiveGeometry> {
  readonly id = lastIndex++; // todo можно удалить?

  abstract snapshot(): T;

  protected _observable = new Observable<T>();

  subscribe(cb: (value: T) => void) {
    return this._observable.subscribe(cb);
  }

  // todo найти лучшее место для debounce
  debouncedNotify = debounce(() => this._observable.notify(this.snapshot()));

  protected _selected = false;

  get selected() {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    this._observable.notify(this.snapshot());
  }

  protected _hovered = false;

  get hovered() {
    return this._hovered;
  }

  set hovered(value: boolean) {
    this._hovered = value;
    this._observable.notify(this.snapshot());
  }
}
