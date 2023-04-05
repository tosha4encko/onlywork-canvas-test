class UI {
  constructor() {
    const addButton: HTMLButtonElement = document.querySelector('#add');
    const deleteButton: HTMLButtonElement = document.querySelector('#delete');
    const prevButton: HTMLButtonElement = document.querySelector('#prev');
    const nextButton: HTMLButtonElement = document.querySelector('#next');

    const canvas: HTMLCanvasElement = document.querySelector('#root-canvas');
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight;

    const dirtyCanvas: HTMLCanvasElement = document.querySelector('#dirty-canvas');
    dirtyCanvas.width = window.innerWidth * 0.75;
    dirtyCanvas.height = window.innerHeight;

    const tempPointCanvas: HTMLCanvasElement = document.querySelector('#temp-point-canvas');
    tempPointCanvas.width = window.innerWidth * 0.75;
    tempPointCanvas.height = window.innerHeight;

    // todo хорошо бы еще проверять типы
    if (!addButton || !deleteButton || !canvas) {
      throw new Error('ui is not defined');
    }
    this.addButton = addButton;
    this.deleteButton = deleteButton;
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    this.canvas = canvas;
    this.dirtyCanvas = dirtyCanvas;
    this.tempPointCanvas = tempPointCanvas;
  }

  readonly addButton: HTMLButtonElement;
  readonly deleteButton: HTMLButtonElement;
  readonly prevButton: HTMLButtonElement;
  readonly nextButton: HTMLButtonElement;
  readonly canvas: HTMLCanvasElement;
  readonly dirtyCanvas: HTMLCanvasElement;
  readonly tempPointCanvas: HTMLCanvasElement;
}

export const ui = new UI();
