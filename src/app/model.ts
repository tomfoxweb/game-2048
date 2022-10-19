import { Cell, ColumnValues, Position, RowValues } from './cell';
import { Randomable } from './randomable';
import { Viewable } from './viewable';

export class Model {
  private view: Viewable;
  private randomizer: Randomable;
  private cellMap: Cell[][];
  private emptyPositions: Position[];

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
    this.emptyPositions = [];
  }

  newGame(): void {
    this.emptyPositions = [];
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        this.cellMap[row][column] = 0;
        this.emptyPositions.push({ row, column });
      }
    }
    const pos1 = this.randomizer.randomPosition(this.emptyPositions);
    const delIndex1 = this.emptyPositions.findIndex(
      (x) => x.row === pos1.row && x.column === pos1.column
    );
    this.emptyPositions.splice(delIndex1, 1);
    const pos2 = this.randomizer.randomPosition(this.emptyPositions);
    const delIndex2 = this.emptyPositions.findIndex(
      (x) => x.row === pos2.row && x.column === pos2.column
    );
    this.emptyPositions.splice(delIndex2, 1);
    const cell1 = this.randomizer.randomNewCell();
    const cell2 = this.randomizer.randomNewCell();
    this.cellMap[pos1.row][pos1.column] = cell1;
    this.cellMap[pos2.row][pos2.column] = cell2;
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        this.view.setCell(row, column, this.cellMap[row][column]);
      }
    }
  }

  shiftUp(): void {
    this.view.setCell(0, 1, 2);
    this.view.setCell(1, 1, 0);
    this.view.setCell(0, 2, 4);
    this.view.setCell(2, 2, 0);
  }

  shiftRight() {
    this.view.setCell(1, 3, 2);
    this.view.setCell(1, 1, 0);
    this.view.setCell(2, 3, 4);
    this.view.setCell(2, 2, 0);
  }

  shiftDown() {
    this.view.setCell(3, 1, 2);
    this.view.setCell(1, 1, 0);
    this.view.setCell(3, 2, 4);
    this.view.setCell(2, 2, 0);
  }

  shiftLeft() {
    this.view.setCell(1, 0, 2);
    this.view.setCell(1, 1, 0);
    this.view.setCell(2, 0, 4);
    this.view.setCell(2, 2, 0);
  }
}
