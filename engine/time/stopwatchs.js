import {ExpAvg} from '../utils/avg'
import {DoEvery} from '../utils/flow'



export class Stopwatch {
  constructor() {
    /** @returns {number} */
    this.cumulatedTime = 0;

    /** @returns {number | null} */
    this.lastLap = null;

    /** @returns {number | null} */
    this.startTime = null;
  }


  /**
   * @returns {number}
   */
  get isRunning() {
    return this.startTime !== null;
  }


  /**
   * @returns {number}
   */
  start() {
    if(!this.isRunning)
      this.startTime = Date.now();
  }


  /**
   * @returns {number}
   */
  stop() {
    if(!this.isRunning) return this.cumulatedTime;

    const eleapsed = Date.now() - this.startTime;
    this.cumulatedTime += eleapsed;
    this.startTime = null;
    return this.cumulatedTime;
  }


  /**
   * @returns {number}
   */
  reset() {
    const total = this.stop();
    this.cumulatedTime = 0;
    return total;
  }


  /**
   * @returns {number}
   */
  lap() {
    const now = Date.now();
    const eleapsed = now - (this.lastLap || this.startTime || now);

    if(this.isRunning)
      this.lastLap = now;

    return eleapsed;
  }
}




export class StopwatchLog extends Stopwatch {
  constructor(name, N = 1, useAvg = false) {
    super();

    const R = useAvg ? .2 : 1;

    this.name = name;
    this.resetAvg = new ExpAvg(R);
    this.lapAvg = new ExpAvg(R);
    this.logStepper = new DoEvery(N);
    this.logEnabled = true;
  }

  /**
   * 
   * @param {string} action 
   * @param {number} value 
   */
  logValue(action, value) {
    if(this.logEnabled)
      console.log(`sw:${this.name}>${action} ${value.toFixed(2)}ms`)
  }

  reset() {
    const res = this.resetAvg.calculate(super.reset());
    this.logStepper.do(() => this.logValue('reset', res));
  }

  lap() {
    const res = this.lapAvg.calculate(super.lap());
    this.logStepper.do(() => this.logValue('lap', res));
  }
}
