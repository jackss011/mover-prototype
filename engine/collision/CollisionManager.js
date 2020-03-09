import { Vector } from 'p5';
import Pool from '../core/Pool'
import Mover from '../core/Mover'
import {TraceMode, Collision, CollisionResponse, Circle} from './Collision'


export default class CollisionManager 
{
  constructor(pool) {
    /** @type {Pool} */
    this.pool = pool;
  }


  /**
   * 
   */
  get context() {
    return this.pool.context;
  }


  /**
   * 
   * @param {Collision} a 
   * @param {Collision} b 
   */
  getCollisionResponse(a, b) {
    //TODO
    return CollisionResponse.PHYSIC;
  }


  /**
   * 
   * @param {Mover} mover 
   * @param {Vector} hit 
   */
  reolverInfinite(mover, {normal, penetration}) {
    const normVelocity = Vector.dot(normal, mover.velocity);
    if (normVelocity > 0) return;

    const e = 1;

    const impulse = Vector.mult(normal, -(1 + e) * normVelocity * mover.mass)
    mover.applyImpulse(impulse);

    const p = 0.5;

    let correction = Vector.mult(normal, p * penetration);
    mover.position.add(correction);
  }



  /**
   * 
   * @param {Mover} a 
   * @param {Mover} b 
   * @param {} param2 
   */
  resolver(a, b, {normal, penetration}) {
    const abv = Vector.sub(b.velocity, a.velocity);
    const normVelocity = Vector.dot(normal, abv);

    if(normVelocity > 0) return;

    const e = Math.min(a.collision.restitution, b.collision.restitution);

    const impulse = Vector.mult(normal, -(1 + e) * normVelocity / (a.invMass + b.invMass));

    //const before = (a.velocity.magSq() + b.velocity.magSq()).toFixed(0)
    
    a.applyImpulse(Vector.mult(impulse, -a.invMass));
    b.applyImpulse(Vector.mult(impulse, b.invMass));

    //const after = (a.velocity.magSq() + b.velocity.magSq()).toFixed(0)
    //console.log({delta: after - before });

    const p = penetration > 3 ? 0.8 : 0.3;
    
    const correction = Vector.mult(normal, p * penetration / (a.invMass + b.invMass));
    a.position.add(Vector.mult(correction, -a.invMass));
    b.position.add(Vector.mult(correction, b.invMass));

    //console.log(correction);
    
  }


  /**
   * 
   */
  resolveCollisionBounds() {
    this.pool.actors.forEach(a => {
      if(!a.collision || !a instanceof Mover) return;

      a.collision.checkOutOfBounds(this.context, hit => this.reolverInfinite(a, hit));
    })
  }


  resolveCollisions() {
    const array = this.pool.actors.filter(a => a.collision);
    
    pairs(array, (a, b) => {
      const hit = this.staticCollision(a.collision, b.collision);
      const response = this.getCollisionResponse(a, b);
    
      switch(response) {
        case CollisionResponse.PHYSIC: {
          if(hit) {
            if(!a instanceof Mover || !b instanceof Mover) return;
            this.resolver(a, b, hit);
            a.collision.onHit(b, b.collision, hit);
            b.collision.onHit(a, a.collision, hit);
          }
          break;
        }

        case CollisionResponse.OVERLAP: {
          if(hit) {

          }
          else {

          }
          break;
        }
      }
    });
  }


  /**
   * 
   * @param {Collision} a 
   * @param {Collision} b 
   */
  staticCollision(a, b) {
    //if(!a || !b) return false;

    return circleVScircle(a, b);
  }

  /**
   * 
   * @param {Vector} point 
   * @param {string} traceChannel
   */
  verticalTrace(point, traceChannel = null) {
    const res = [];
    let done = false;

    this.pool.actors.forEach(a => {
      if(!a.collision || done) return;

      if(traceChannel) {
        const response = 
          a.collision.traceResponse[traceChannel] || a.collision.traceResponse.default;

        if(response === TraceMode.BLOCK) done = true;
        if(response === TraceMode.IGNORE || response == null) return;
      }

      const hit = a.collision.pointHit(point);
      if(hit) res.push({actor: a, hit});
    })

    return res;
  }
}




/**
 * 
 * @param {Circle} a 
 * @param {Circle} b 
 */
function circleVScircle(a, b) {
  const ab = Vector.sub(b.position, a.position);
  const d2 = ab.magSq();

  const r = a.radius + b.radius;
  const r2 = r * r;

  if(d2 > r2) return false;

  const d = Math.sqrt(d2);

  const normal = Vector.div(ab, d);
  const penetration = r - d;

  return {normal, penetration};
}



/**
 * 
 * @param {Array<T>} array 
 * @param {(a: T, b: T) => void} action
 */
function pairs(array, action) {
  for(let i = 0; i < array.length - 1; i++)
    for(let j = i + 1; j < array.length; j++)
      action(array[i], array[j]);
}