import { Pane } from "tweakpane";

export default class Debug {
  constructor() {
    this.gui = new Pane({
      title: "Parameters",
    });
  }

  destroy() {
    if (!this.gui) return;

    this.gui.dispose();
    this.gui = null;
  }
}
