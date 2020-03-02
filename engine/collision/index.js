import p5, { Vector } from "p5";


/**
 * 
 * @param {Mover} mover 
 * @param {Vector} hit 
 */
export function resolveBound(mover, {normal, penetration}) {
  const normVelocity = Vector.dot(normal, mover.velocity);
  if (normVelocity > 0) return;

  const impulse = Vector.mult(normal, -1.8 * normVelocity * mover.mass)
  mover.applyImpulse(impulse);

  let correction = Vector.mult(normal, 0.5 * penetration);
  mover.position.add(correction);
}



export class Collision {
  constructor() {
    /** @type {string} */
    this.type = null;
    this.attachment = null;
  }

  get position() {
    if(this.attachment) 
      return this.attachment.position;

    return new Vector();
  }
}



export class Circle extends Collision {
  /**
   * 
   * @param {number} radius 
   */
  constructor(radius) {
    super();

    this.type = 'circle';
    this.radius = radius;
  }


  /**
   * @param {p5} context 
   * @param {(Vector) => void} resolver 
   */
  checkOutOfBounds(context, resolver) {
    let max = new Vector(this.radius, this.radius);
    let min = new Vector(-this.radius, -this.radius);
    max.add(this.position);
    min.add(this.position);

    if (min.x < 0) {
      resolver({
        normal: new Vector(1, 0), 
        penetration: -min.x
      });
    }

    if (min.y < 0) {
      resolver({
        normal: new Vector(0, 1), 
        penetration: -min.y
      });
    }

    if (max.x > context.width) {
      resolver({
        normal: new Vector(-1, 0), 
        penetration: max.x - context.width
      });
    }

    if (max.y > context.height) {
      resolver({
        normal: new Vector(0, -1), 
        penetration: max.y - context.height
      });
    }
  }


  /**
   * 
   * @param {Vector} point 
   */
  pointHit(point) {
    const diff = Vector.sub(point, this.position);

    if(diff.magSq() < this.radius * this.radius)
      return { relative: diff }

    return false;
  }
}