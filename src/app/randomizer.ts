import { Column, ColumnValues, NewCell, Row, RowValues } from './cell';
import { Randomable } from './randomable';

export class Randomizer implements Randomable {
  randomRow(): Row {
    return this.randomInteger(0, RowValues.length - 1) as Row;
  }

  randomColumn(): Column {
    return this.randomInteger(0, ColumnValues.length - 1) as Column;
  }

  randomNewCell(): NewCell {
    return this.randomInteger(0, 1) === 0 ? 2 : 4;
  }

  private randomInteger(min: number, max: number): number {
    min = Math.trunc(min);
    max = Math.trunc(max);
    return Math.trunc(Math.random() * (max - min + 1)) + min;
  }
}
