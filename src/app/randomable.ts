import { NewCell, Position } from './cell';

export interface Randomable {
  randomPosition(emptyPositions: Position[]): Position | null;
  randomNewCell(): NewCell;
}
