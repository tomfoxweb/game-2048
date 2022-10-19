import { ColumnValues, RowValues } from './cell';
import { Viewable } from './viewable';

export class Model {
  private view: Viewable;
  constructor(view: Viewable) {
    this.view = view;
  }

  newGame(): void {
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        this.view.setCell(row, column, 0);
      }
    }
  }
}
