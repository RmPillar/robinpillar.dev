import { Pane } from "tweakpane";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (!this.active) return;

    if (window.gui) {
      this.gui = window.gui;
    } else {
      this.gui = new Pane({
        title: "Parameters",
      });

      window.gui = this.gui;
    }
  }
}
