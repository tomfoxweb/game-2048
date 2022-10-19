import { Cell, ColumnValues, RowValues } from './cell';
import { Randomable } from './randomable';
import { Viewable } from './viewable';

export class Model {
  private view: Viewable;
  private randomizer: Randomable;
  private cellMap: Cell[][];

  constructor(view: Viewable, randomizer: Randomable) {
    this.view = view;
    this.randomizer = randomizer;
    this.cellMap = [];
    for (const row of RowValues) {
      this.cellMap.push([]);
      for (const column of ColumnValues) {
        this.cellMap[row].push(0);
      }
    }
  }

  newGame(): void {
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        this.cellMap[row][column] = 0;
      }
    }
    const row1 = this.randomizer.randomRow();
    const col1 = this.randomizer.randomColumn();
    const row2 = this.randomizer.randomRow();
    const col2 = this.randomizer.randomColumn();
    this.cellMap[row1][col1] = 2;
    this.cellMap[row2][col2] = 2;
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        this.view.setCell(row, column, this.cellMap[row][column]);
      }
    }
  }
}
