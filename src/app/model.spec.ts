import { Cell, Column, ColumnValues, Row, RowValues } from './cell';
import { Model } from './model';
import { Randomable } from './randomable';
import { Viewable } from './viewable';

class TestView implements Viewable {
  setCell(row: Row, column: Column, cell: Cell): void {}
}

class TestRandom implements Randomable {
  indexRow = 0;
  indexColumn = 0;
  valuesRow: Row[] = [];
  valuesColumn: Column[] = [];

  randomRow(): Row {
    return this.valuesRow[this.indexRow++];
  }

  randomColumn(): Column {
    return this.valuesColumn[this.indexColumn++];
  }
}

describe('Model: new game', () => {
  let view: Viewable;
  let randomizer: TestRandom;
  let row1: Row = 1;
  let col1: Column = 2;
  let row2: Row = 3;
  let col2: Column = 0;
  let model: Model;

  beforeEach(() => {
    view = new TestView();
    spyOn(view, 'setCell');
    randomizer = new TestRandom();
    randomizer.valuesRow.push(row1, row2);
    randomizer.valuesColumn.push(col1, col2);
    model = new Model(view, randomizer);
    model.newGame();
  });

  it('should set 16 cells by view.setCell', () => {
    expect(view.setCell).toHaveBeenCalledTimes(16);
  });

  it('should set all cells in row column combinations', () => {
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        expect(view.setCell).toHaveBeenCalledWith(
          row,
          column,
          jasmine.anything()
        );
      }
    }
  });

  it('should add two 2 cells', () => {
    const testingMap: Cell[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    testingMap[row1][col1] = 2;
    testingMap[row2][col2] = 2;
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        expect(view.setCell).toHaveBeenCalledWith(
          row,
          column,
          testingMap[row][column]
        );
      }
    }
  });
});
