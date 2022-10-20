import { Component, HostListener, OnInit } from '@angular/core';
import { Cell, Column, ColumnValues, Row, RowValues } from './cell';
import { ControllerService } from './controller.service';
import { Viewable } from './viewable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, Viewable {
  @HostListener('window:keydown.ArrowUp', ['$event'])
  handleArrowUp(event: KeyboardEvent) {
    this.controller.shiftUp();
  }

  @HostListener('window:keydown.ArrowRight', ['$event'])
  handleArrowRight(event: KeyboardEvent) {
    this.controller.shiftRight();
  }

  @HostListener('window:keydown.ArrowDown', ['$event'])
  handleArrowDown(event: KeyboardEvent) {
    this.controller.shiftDown();
  }

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  handleArrowLeft(event: KeyboardEvent) {
    this.controller.shiftLeft();
  }

  title = 'game-2048';
  cells: Cell[] = [];

  constructor(private controller: ControllerService) {}

  ngOnInit(): void {
    for (const row of RowValues) {
      for (const column of ColumnValues) {
        this.cells.push(0);
      }
    }
    this.controller.setView(this);
    this.newGame();
  }

  setCell(row: Row, column: Column, cell: Cell): void {
    const index = row * 4 + column;
    this.cells[index] = cell;
  }

  newGame(): void {
    this.controller.newGame();
  }

  showGameOver(): void {
    window.setTimeout(() => {
      alert('Game Over!');
    }, 100);
  }
}
