import { jsPlumb, jsPlumbInstance } from 'jsplumb';

class PlumbingProvider {
  public scalePlumbing: jsPlumbInstance;
  public signalPlumbing: jsPlumbInstance;
  public fieldPlumbing: jsPlumbInstance;
  public datasetPlumbing: jsPlumbInstance;
  public visualElementPlumbing: jsPlumbInstance;
  public layoutPlumbing: jsPlumbInstance;
  public interactionPlumbing: jsPlumbInstance;
  public dynamicValuePlumbing: jsPlumbInstance;

  constructor() {
    this.visualElementPlumbing = jsPlumb.getInstance();
    this.layoutPlumbing = jsPlumb.getInstance();
    this.datasetPlumbing = jsPlumb.getInstance();
    this.scalePlumbing = jsPlumb.getInstance();
    this.signalPlumbing = jsPlumb.getInstance();
    this.fieldPlumbing = jsPlumb.getInstance();
    this.interactionPlumbing = jsPlumb.getInstance();
    this.dynamicValuePlumbing = jsPlumb.getInstance();
  }
}

export const plumbingProvider = new PlumbingProvider();