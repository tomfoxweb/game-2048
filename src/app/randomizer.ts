import { NewCell, Position } from './cell';
import { Randomable } from './randomable';

export class Randomizer implements Randomable {
  randomPosition(emptyPositions: Position[]): Position | null {
    if (emptyPositions.length === 0) {
      return null;
    }
    const index = this.randomInteger(0, emptyPositions.length - 1);
    const position = emptyPositions[index];
    return position;
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
