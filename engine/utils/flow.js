
export class DoEvery {
  constructor(N) {
    this.N = N;
    this.cnt = 0;
  }


  do(action) {
    if((this.cnt++ % this.N) == 0) 
      action();
  }
}