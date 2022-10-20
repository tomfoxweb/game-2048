import {
  Cell,
  Column,
  ColumnValues,
  COLUMN_COUNT,
  GameMap,
  Position,
  Row,
  RowValues,
  ROW_COUNT,
} from './cell';
import { Randomable } from './randomable';
import { Viewable } from './viewable';

export class Model {
  private view: Viewable;
  private randomizer: Randomable;
  private cellMap: GameMap;
  private emptyPositions: Position[];

  constructor(view: Viewable, randomizer: Randomable) {
    this.view = view;
    this.randomizer = randomizer;
    this.cellMap = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.emptyPositions = [];
  }

  newGame(
    cellMap: GameMap = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
  ): void {
    this.cellMap = cellMap;
    this.emptyPositions = [];
    for (const row of RowValues) {
      for (const column of ColumnValues) {
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
    for (const column of ColumnValues) {
      for (const row1 of RowValues) {
        if (this.cellMap[row1][column] !== 0) {
          continue;
        }
        for (let row2 = row1 + 1; row2 < ROW_COUNT; row2++) {
          if (this.cellMap[row2][column] !== 0) {
            this.cellMap[row1][column] = this.cellMap[row2][column];
            this.cellMap[row2][column] = 0;
            this.view.setCell(row1, column, this.cellMap[row1][column]);
            this.view.setCell(row2 as Row, column, this.cellMap[row2][column]);
            break;
          }
        }
      }
    }
  }

  shiftRight() {
    for (const row of RowValues) {
      for (let col1 = COLUMN_COUNT - 1; col1 > 0; col1--) {
        if (this.cellMap[row][col1] !== 0) {
          continue;
        }
        for (let col2 = col1 - 1; col2 >= 0; col2--) {
          if (this.cellMap[row][col2] !== 0) {
            this.cellMap[row][col1] = this.cellMap[row][col2];
            this.cellMap[row][col2] = 0;
            this.view.setCell(row, col1 as Column, this.cellMap[row][col1]);
            this.view.setCell(row, col2 as Column, this.cellMap[row][col2]);
            break;
          }
        }
      }
    }
  }

  shiftDown() {
    for (const column of ColumnValues) {
      for (let row1 = ROW_COUNT - 1; row1 > 0; row1--) {
        if (this.cellMap[row1][column] !== 0) {
          continue;
        }
        for (let row2 = row1 - 1; row2 >= 0; row2--) {
          if (this.cellMap[row2][column] !== 0) {
            this.cellMap[row1][column] = this.cellMap[row2][column];
            this.cellMap[row2][column] = 0;
            this.view.setCell(row1 as Row, column, this.cellMap[row1][column]);
            this.view.setCell(row2 as Row, column, this.cellMap[row2][column]);
            break;
          }
        }
      }
    }
  }

  shiftLeft() {
    for (const row of RowValues) {
      for (let col1 = 0; col1 < COLUMN_COUNT - 1; col1++) {
        if (this.cellMap[row][col1] !== 0) {
          continue;
        }
        for (let col2 = col1 + 1; col2 < COLUMN_COUNT; col2++) {
          if (this.cellMap[row][col2] !== 0) {
            this.cellMap[row][col1] = this.cellMap[row][col2];
            this.cellMap[row][col2] = 0;
            this.view.setCell(row, col1 as Column, this.cellMap[row][col1]);
            this.view.setCell(row, col2 as Column, this.cellMap[row][col2]);
            break;
          }
        }
      }
    }
  }
}
