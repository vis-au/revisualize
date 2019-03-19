export default class AddTemplateButtonObserver {
  private callbacks: (() => void)[] = [];

  public join(callback: () => void) {
    this.callbacks.push(callback);
  }

  public notifyAll(excludedCallback: () => void) {
    this.callbacks
      .filter(c => c !== excludedCallback)
      .forEach(callback => {
        callback();
      });
  }
}