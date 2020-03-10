import {Vector} from 'p5'

import {Mover} from '../core/Mover'


/**
 * 
 * @param {Mover} mover 
 * @param {Vector} hit 
 */
export function resolveBoundCollision(mover, {normal, penetration}) {
  const normVelocity = Vector.dot(normal, mover.velocity);
  if (normVelocity > 0) return;

  const e = mover.physics.boundsRestitution;

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
export function resolveCollision(a, b, {normal, penetration}) {
  const abv = Vector.sub(b.velocity, a.velocity);
  const normVelocity = Vector.dot(normal, abv);

  if(normVelocity > 0) return;

  const e = Math.min(a.physics.restitution, b.physics.restitution);

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
