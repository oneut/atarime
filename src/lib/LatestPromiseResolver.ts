export class LatestPromiseResolver<S> {
  private promise?: Promise<S>;
  private callback: (value: any) => void;

  constructor() {
    this.promise = undefined;
    this.callback = () => {};
  }

  next(promise: Promise<S>) {
    this.promise = promise;
    promise.then((value) => {
      if (promise === this.promise) {
        this.callback(value);
      }
    });
  }

  subscribe(callback: (value: any) => void) {
    this.callback = callback;
  }
}
