import { Pane } from "tweakpane";

export default class Debug {
  constructor() {
    this.gui = new Pane({
      title: "Parameters",
    });

    this.gui.expanded = false;
  }

  destroy() {
    if (!this.gui) return;

    this.gui.dispose();
    this.gui = null;
  }
}
