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
  private cellsHaveMoved: boolean;

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
    this.cellsHaveMoved = false;
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
        if (this.cellMap[row][column] === 0) {
          this.emptyPositions.push({ row, column });
        }
      }
    }
    this.cellsHaveMoved = false;
    this.addNewCellOnMap();
    this.addNewCellOnMap();
    this.showGameMap();
  }

  private addNewCellOnMap(): void {
    if (this.emptyPositions.length === 0) {
      return;
    }
    const position = this.randomizer.randomPosition(this.emptyPositions);
    if (position === null || position === undefined) {
      return;
    }
    this.removeFromEmptyPositions(position);
    const newCell = this.randomizer.randomNewCell();
    this.cellMap[position.row][position.column] = newCell;
  }

  private addToEmptyPositions(position: Position): void {
    const pos = this.emptyPositions.find(
      (x) => x.row === position.row && x.column === position.column
    );
    if (pos === undefined) {
      this.emptyPositions.push({ ...position });
    }
  }

  private removeFromEmptyPositions(position: Position): void {
    const index = this.emptyPositions.findIndex(
      (x) => x.row === position.row && x.column === position.column
    );
    if (index < 0) {
      return;
    }
    this.emptyPositions.splice(index, 1);
  }

  private showGameMap(): void {
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        this.view.setCell(row, column, this.cellMap[row][column]);
      }
    }
  }

  private checkForGameOver(): void {
    if (this.emptyPositions.length !== 0) {
      return;
    }
    const canCombine =
      this.canCombineLeft() ||
      this.canCombineRight() ||
      this.canCombineDown() ||
      this.canCombineUp();
    if (!canCombine) {
      this.view.showGameOver();
    }
  }

  private canCombineUp(): boolean {
    for (const column of ColumnValues) {
      for (let row = 0; row < ROW_COUNT - 1; row++) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row + 1][column];
        if (firstCell === secondCell) {
          return true;
        }
      }
    }
    return false;
  }

  private canCombineRight(): boolean {
    for (const row of RowValues) {
      for (let column = COLUMN_COUNT - 1; column > 0; column--) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row][column - 1];
        if (firstCell === secondCell) {
          return true;
        }
      }
    }
    return false;
  }

  private canCombineDown(): boolean {
    for (const column of ColumnValues) {
      for (let row = ROW_COUNT - 1; row > 0; row--) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row - 1][column];
        if (firstCell === secondCell) {
          return true;
        }
      }
    }
    return false;
  }

  private canCombineLeft(): boolean {
    for (const row of RowValues) {
      for (let column = 0; column < COLUMN_COUNT - 1; column++) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row][column + 1];
        if (firstCell === secondCell) {
          return true;
        }
      }
    }
    return false;
  }

  shiftUp(): void {
    this.cellsHaveMoved = false;
    this.shiftCellsUp();
    this.combineCellsUp();
    this.shiftCellsUp();
    if (this.cellsHaveMoved) {
      this.addNewCellOnMap();
    }
    this.showGameMap();
    this.checkForGameOver();
  }

  private shiftCellsUp(): void {
    for (const column of ColumnValues) {
      for (const row1 of RowValues) {
        if (this.cellMap[row1][column] !== 0) {
          continue;
        }
        for (let row2 = row1 + 1; row2 < ROW_COUNT; row2++) {
          if (this.cellMap[row2][column] !== 0) {
            this.cellsHaveMoved = true;
            this.cellMap[row1][column] = this.cellMap[row2][column];
            this.removeFromEmptyPositions({ row: row1, column: column });
            this.cellMap[row2][column] = 0;
            this.addToEmptyPositions({ row: row2 as Row, column: column });
            break;
          }
        }
      }
    }
  }

  private combineCellsUp(): void {
    for (const column of ColumnValues) {
      for (let row = 0; row < ROW_COUNT - 1; row++) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row + 1][column];
        if (firstCell === secondCell) {
          this.cellsHaveMoved = true;
          this.cellMap[row][column] = (firstCell * 2) as Cell;
          this.cellMap[row + 1][column] = 0;
          this.addToEmptyPositions({ row: (row + 1) as Row, column: column });
        }
      }
    }
  }

  shiftRight(): void {
    this.cellsHaveMoved = false;
    this.shiftCellsRight();
    this.combineCellsRight();
    this.shiftCellsRight();
    if (this.cellsHaveMoved) {
      this.addNewCellOnMap();
    }
    this.showGameMap();
    this.checkForGameOver();
  }

  private shiftCellsRight(): void {
    for (const row of RowValues) {
      for (let col1 = COLUMN_COUNT - 1; col1 > 0; col1--) {
        if (this.cellMap[row][col1] !== 0) {
          continue;
        }
        for (let col2 = col1 - 1; col2 >= 0; col2--) {
          if (this.cellMap[row][col2] !== 0) {
            this.cellsHaveMoved = true;
            this.cellMap[row][col1] = this.cellMap[row][col2];
            this.removeFromEmptyPositions({
              row: row,
              column: col1 as Column,
            });
            this.cellMap[row][col2] = 0;
            this.addToEmptyPositions({ row: row, column: col2 as Column });
            break;
          }
        }
      }
    }
  }

  private combineCellsRight(): void {
    for (const row of RowValues) {
      for (let column = COLUMN_COUNT - 1; column > 0; column--) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row][column - 1];
        if (firstCell === secondCell) {
          this.cellsHaveMoved = true;
          this.cellMap[row][column] = (firstCell * 2) as Cell;
          this.cellMap[row][column - 1] = 0;
          this.addToEmptyPositions({
            row: row,
            column: (column - 1) as Column,
          });
        }
      }
    }
  }

  shiftDown(): void {
    this.cellsHaveMoved = false;
    this.shiftCellsDown();
    this.combineCellsDown();
    this.shiftCellsDown();
    if (this.cellsHaveMoved) {
      this.addNewCellOnMap();
    }
    this.showGameMap();
    this.checkForGameOver();
  }

  private shiftCellsDown(): void {
    for (const column of ColumnValues) {
      for (let row1 = ROW_COUNT - 1; row1 > 0; row1--) {
        if (this.cellMap[row1][column] !== 0) {
          continue;
        }
        for (let row2 = row1 - 1; row2 >= 0; row2--) {
          if (this.cellMap[row2][column] !== 0) {
            this.cellsHaveMoved = true;
            this.cellMap[row1][column] = this.cellMap[row2][column];
            this.removeFromEmptyPositions({
              row: row1 as Row,
              column: column,
            });
            this.cellMap[row2][column] = 0;
            this.addToEmptyPositions({ row: row2 as Row, column: column });
            break;
          }
        }
      }
    }
  }

  private combineCellsDown(): void {
    for (const column of ColumnValues) {
      for (let row = ROW_COUNT - 1; row > 0; row--) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row - 1][column];
        if (firstCell === secondCell) {
          this.cellsHaveMoved = true;
          this.cellMap[row][column] = (firstCell * 2) as Cell;
          this.cellMap[row - 1][column] = 0;
          this.addToEmptyPositions({ row: (row - 1) as Row, column: column });
        }
      }
    }
  }

  shiftLeft(): void {
    this.cellsHaveMoved = false;
    this.shiftCellsLeft();
    this.combineCellsLeft();
    this.shiftCellsLeft();
    if (this.cellsHaveMoved) {
      this.addNewCellOnMap();
    }
    this.showGameMap();
    this.checkForGameOver();
  }

  private shiftCellsLeft(): void {
    for (const row of RowValues) {
      for (let col1 = 0; col1 < COLUMN_COUNT - 1; col1++) {
        if (this.cellMap[row][col1] !== 0) {
          continue;
        }
        for (let col2 = col1 + 1; col2 < COLUMN_COUNT; col2++) {
          if (this.cellMap[row][col2] !== 0) {
            this.cellsHaveMoved = true;
            this.cellMap[row][col1] = this.cellMap[row][col2];
            this.removeFromEmptyPositions({
              row: row,
              column: col1 as Column,
            });
            this.cellMap[row][col2] = 0;
            this.addToEmptyPositions({ row: row, column: col2 as Column });
            break;
          }
        }
      }
    }
  }

  private combineCellsLeft(): void {
    for (const row of RowValues) {
      for (let column = 0; column < COLUMN_COUNT - 1; column++) {
        const firstCell = this.cellMap[row][column];
        if (firstCell === 0) {
          continue;
        }
        const secondCell = this.cellMap[row][column + 1];
        if (firstCell === secondCell) {
          this.cellsHaveMoved = true;
          this.cellMap[row][column] = (firstCell * 2) as Cell;
          this.cellMap[row][column + 1] = 0;
          this.addToEmptyPositions({
            row: row,
            column: (column + 1) as Column,
          });
        }
      }
    }
  }
}
