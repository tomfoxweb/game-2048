import { NewCell, Position } from './cell';

export interface Randomable {
  randomPosition(emptyPositions: Position[]): Position;
  randomNewCell(): NewCell;
}
