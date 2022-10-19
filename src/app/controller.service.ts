import { Injectable } from '@angular/core';
import { Model } from './model';
import { Randomizer } from './randomizer';
import { Viewable } from './viewable';

@Injectable({
  providedIn: 'root',
})
export class ControllerService {
  private view: Viewable | undefined;
  private model: Model | undefined;
  private randomizer: Randomizer;

  constructor() {
    this.randomizer = new Randomizer();
  }

  setView(view: Viewable): void {
    this.view = view;
    this.model = new Model(this.view, this.randomizer);
  }

  newGame(): void {
    if (this.view === undefined) {
      throw new Error('Undefined view in controller newGame');
    }
    if (this.model === undefined) {
      throw new Error('Undefined model in controller newGame');
    }
    this.model.newGame();
  }
}
