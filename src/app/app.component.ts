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

  @HostListener('window:pointerdown', ['$event'])
  handlePointerDown(event: PointerEvent) {
    event.preventDefault();
    this.setStartTouchPosition(event);
  }

  @HostListener('window:pointerup', ['$event'])
  handlePointerUp(event: PointerEvent) {
    event.preventDefault();
    this.setEndTouchPosition(event);
    this.processPointerMove();
  }

  title = 'game-2048';
  cells: Cell[] = [];

  private touchStartX = 0;
  private touchStartY = 0;
  private touchEndX = 0;
  private touchEndY = 0;

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

  private setStartTouchPosition(event: PointerEvent): void {
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
  }

  private setEndTouchPosition(event: PointerEvent): void {
    this.touchEndX = event.clientX;
    this.touchEndY = event.clientY;
  }

  private processPointerMove(): void {
    const sx = Math.abs(this.touchEndX - this.touchStartX);
    const sy = Math.abs(this.touchEndY - this.touchStartY);
    if (sx + sy < 50) {
      return;
    }
    if (sx > sy) {
      if (this.touchEndX > this.touchStartX) {
        this.controller.shiftRight();
      } else {
        this.controller.shiftLeft();
      }
    } else {
      if (this.touchEndY > this.touchStartY) {
        this.controller.shiftDown();
      } else {
        this.controller.shiftUp();
      }
    }
  }
}
