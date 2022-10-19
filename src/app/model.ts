import { ViewChild } from '@angular/core';
import { Viewable } from './viewable';

export class Model {
  private view: Viewable;
  constructor(view: Viewable) {
    this.view = view;
  }

  newGame(): void {
    for (let i = 0; i < 16; i++) {
      this.view.setCell(0, 0, 0);
    }
  }
}
