
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


export function grid2D(nx, ny, stepx = 1, stepy = undefined) {
  if(stepy == undefined) stepy = stepx;

  return Array(Math.floor(nx * ny)).fill(0).map((v, i, a) => ({
    x: (i % nx) * stepx,
    y: Math.floor(i / nx) * stepy,
  }));
}