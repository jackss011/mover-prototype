
export class Timer 
{
  constructor() {
    this.looping = false;
    this.interval = [0, 0];
    this.action = null;
    this.random = false;

    this.handle = null;
    this.ready = 0;
  }


  /**
   * @param {number} value
   */
  set time(value) {
    this.interval[0] = value;
    this.interval[1] = 0;
    this.random = false;
  }

  
  /**
   * @param {number[]} value
   */
  set randomRange(value) {
    this.interval = value;
    this.random = true;
  }


  /**
   * 
   * @param {number} center 
   * @param {nunber} dist 
   */
  centerRange(center, dist) {
    this.interval[0] = center - dist;
    this.interval[1] = center + dist;
    this.random = true;
  }


  get delta() {
    if(this.random === false)
      return this.interval[0];

    return this.interval[0] + (this.interval[1] - this.interval[0]) * Math.random();
  }


  tick() {
    while(this.ready > 0) {
      if(this.action)
        this.action();
      
      this.ready--;
    }
  }


  start() {
    if(this.handle) return;

    this.handle = setTimeout(() => {
      this.ready++;
      this.handle = null;

      if(this.looping)
        this.start();
    }, 
    this.delta * 1000);
  }




  clear() {
    clearInterval(this.handle);
    this.ready = 0;
  }
}