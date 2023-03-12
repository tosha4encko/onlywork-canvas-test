class UI {
  constructor() {
    const addButton: HTMLButtonElement = document.querySelector('#add');
    const deleteButton: HTMLButtonElement = document.querySelector('#delete');

    const canvas: HTMLCanvasElement = document.querySelector('#root-canvas');
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight;

    const editableCanvas: HTMLCanvasElement = document.querySelector('#root-canvas');
    editableCanvas.width = window.innerWidth * 0.75;
    editableCanvas.height = window.innerHeight;

    // todo хорошо бы еще проверять типы
    if (!addButton || !deleteButton || !canvas) {
      throw new Error('ui is not defined');
    }
    this.addButton = addButton;
    this.deleteButton = deleteButton;
    this.canvas = canvas;
    this.editableCanvas = editableCanvas;
  }

  readonly addButton: HTMLButtonElement;
  readonly deleteButton: HTMLButtonElement;
  readonly canvas: HTMLCanvasElement;
  readonly editableCanvas: HTMLCanvasElement;
}

export const ui = new UI();
