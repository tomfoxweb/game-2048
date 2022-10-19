import { Model } from './model';
import { Viewable } from './viewable';

class TestView implements Viewable {
  setCell(
    row: 0 | 2 | 1 | 3,
    column: 0 | 2 | 1 | 3,
    cell:
      | 0
      | 2
      | 4
      | 8
      | 16
      | 32
      | 64
      | 128
      | 256
      | 512
      | 1024
      | 2048
      | 4096
      | 8192
      | 16384
      | 32768
      | 65536
  ): void {}
}

describe('Model: new game', () => {
  let view: Viewable;
  let model: Model;

  beforeEach(() => {
    view = new TestView();
    spyOn(view, 'setCell');
    model = new Model(view);
    model.newGame();
  });

  it('should set 16 cells by view.setCell', () => {
    expect(view.setCell).toHaveBeenCalledTimes(16);
  });
});
