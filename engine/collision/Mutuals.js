import {Vector} from 'p5'
import {Circle} from './Collision'

/**
 * 
 * @param {Circle} a 
 * @param {Circle} b 
 */
export function circleVScircle(a, b) {
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

