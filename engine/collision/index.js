import p5, {
  Vector
} from "p5";


/**
 * 
 * @param {Mover} mover 
 * @param {Vector} hit 
 */
export function resolveBound(mover, hit) {
  const normVelocity = Vector.dot(hit, mover.velocity);
  if (normVelocity > 0) return;

  const impulse = Vector.mult(hit, -1.8 * normVelocity * mover.mass)
  mover.applyImpulse(impulse);
}



export class Circle {
  /**
   * 
   * @param {number} radius 
   */
  constructor(radius) {
    this.type = 'circle';
    this.radius = radius;
    this.position = new Vector();
    this.attachment = null;
  }


  /**
   * @param {p5} context 
   * @param {(Vector) => void} resolver 
   */
  checkOutOfBounds(context, resolver) {
    const pos = this.attachment ? this.attachment.position : this.position;

    let max = new Vector(this.radius, this.radius);
    let min = new Vector(-this.radius, -this.radius);
    max.add(pos);
    min.add(pos);

    if (min.x < 0) {
      resolver(new Vector(1, 0));
    }

    if (min.y < 0) {
      resolver(new Vector(0, 1));
    }

    if (max.x > context.width) {
      resolver(new Vector(-1, 0));
    }

    if (max.y > context.height) {
      resolver(new Vector(0, -1))
    }
  }
}