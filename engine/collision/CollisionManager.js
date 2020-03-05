import { Vector } from 'p5';
import Pool from '../core/Pool'
import Mover from '../core/Mover'


export default class CollisionManager 
{
  constructor(pool) {
    /** @type {Pool} */
    this.pool = pool;
  }

  get context() {
    return this.pool.context;
  }


  /**
   * 
   * @param {Mover} mover 
   * @param {Vector} hit 
   */
  resolveBound(mover, {normal, penetration}) {
    const normVelocity = Vector.dot(normal, mover.velocity);
    if (normVelocity > 0) return;

    const impulse = Vector.mult(normal, -1.8 * normVelocity * mover.mass)
    mover.applyImpulse(impulse);

    let correction = Vector.mult(normal, 0.5 * penetration);
    mover.position.add(correction);
  }


  /**
   * 
   */
  resolveCollisionBounds() {
    this.pool.actors.forEach(a => {
      if(!a.collision || !a instanceof Mover) return;

      a.collision.checkOutOfBounds(this.context, hit => this.resolveBound(a, hit));
    })
  }


  /**
   * 
   * @param {Vector} point 
   */
  verticalTrace(point) {
    const res = [];

    this.pool.actors.forEach(a => {
      if(!a.collision) return;

      const hit = a.collision.pointHit(point);
      if(hit) res.push({actor: a, hit});
    })

    return res;
  }
} 