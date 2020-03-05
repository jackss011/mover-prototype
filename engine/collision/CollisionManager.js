import { Vector } from 'p5';
import Pool from '../core/Pool'
import Mover from '../core/Mover'
import {TraceMode, Collision, CollisionResponse, Circle} from './index'


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
    return CollisionResponse.BOUNCE;
  }


  /**
   * 
   * @param {Mover} mover 
   * @param {Vector} hit 
   */
  boundResolver(mover, {normal, penetration}) {
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

    const before = (a.velocity.magSq() + b.velocity.magSq()).toFixed(0)
    
    a.applyImpulse(Vector.mult(impulse, -a.invMass));
    b.applyImpulse(Vector.mult(impulse, b.invMass));

    const after = (a.velocity.magSq() + b.velocity.magSq()).toFixed(0)
    console.log({delta: after - before });

    const p = penetration > 3 ? 0.8 : 0.3;
    
    const correction = Vector.mult(normal, p * penetration / (a.invMass + b.invMass));
    a.position.add(Vector.mult(correction, -a.invMass));
    b.position.add(Vector.mult(correction, b.invMass));

    console.log(correction);
    
  }


  /**
   * 
   */
  resolveCollisionBounds() {
    this.pool.actors.forEach(a => {
      if(!a.collision || !a instanceof Mover) return;

      a.collision.checkOutOfBounds(this.context, hit => this.boundResolver(a, hit));
    })
  }


  resolveCollisions() {
    const array = this.pool.actors.filter(a => a instanceof Mover);
    
    for(let i = 0; i < array.length - 1; i++) {
      for(let j = i + 1; j < array.length; j++) {
        const a = array[i];
        const b = array[j];
        //console.log({a, b});
        
        const hit = circleVScircle(a, b);

        if(hit) {
          this.resolver(a, b, hit);
        }
      }
    }
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