

export class ExpAvg {
  /**
   * 
   * @param {number} R 
   */
  constructor(R) {
    this.avg = null;
    this.R = Math.max(R, 0);
  }

  /**
   *  @returns {number} 
   */
  get value() {
    return this.avg || 0;
  }

  /**
   * 
   * @param {number} value 
   * @returns {number}
   */
  calculate(value) {
    if(this.avg === null)
      this.avg = value;

    this.avg = this.avg * (1 - this.R) + this.R * value;

    return this.avg;
  }

  /**
   * 
   */
  reset() {
    this.avg = null;
  }
}