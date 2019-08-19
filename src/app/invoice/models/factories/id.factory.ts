export class IdFactory {
  static create() {
    return Math.random().toString(36).substring(7);
  }
}
