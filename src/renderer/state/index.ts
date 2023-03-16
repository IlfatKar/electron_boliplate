import { makeAutoObservable } from 'mobx';

class State {
  constructor() {
    makeAutoObservable(this);
  }

  a = 1;
}
export default new State();
