import { Vector } from 'p5';
import Pool from '../core/Pool'
import Mover from '../core/Mover'
import {TraceMode, Collision, CollisionResponse, Circle, EngineCollisionChannel} from './Collision'


export default class CollisionManager 
{
  constructor(pool) {
    /** @type {Pool} */
    this.pool = pool;

    this.collisionResponses = [];
    this.collisions = {};

    this.createCollisionChannel(EngineCollisionChannel.DEFAULT, null);
  }


    /**
   * 
   */
  get context() {
    return this.pool.context;
  }


  collisonChannelExists(id) {
    return !(this.collisions[id] === undefined);
  }

/**
 *
 * @param {hit: {id: string, selfResponse: string}} param0 
 */
  createCollisionChannel(id, selfResponse) {
    if(!this.collisonChannelExists(id)) {
      this.collisions[id] = [];
      this.configureCollisionResponse(id, id, selfResponse || null);
    }
  }


/**
 * 
 * @param {string} idA 
 * @param {string} idB 
 * @param {string} response 
 */
  configureCollisionResponse(idA, idB, response = null) {
    if(response && response !== CollisionResponse.IGNORE) {
      const pair = [idA, idB].sort();

      this.collisionResponses.push({pair, response});
    }
  }




  /**
   * 
   * @param {Collision} a 
   * @param {Collision} b 
   */
  getCollisionResponse(a, b) {
    const [idA, idB] = [a, b].sort();
    
    return this.collisionResponses
      .find(( {pair} ) => idA === pair[0] && idB === pair[1])
      || CollisionResponse.IGNORE;
  }

  /**
   * 
   * @param {Collision} c 
   */
  addCollision(c) {
    if(!c instanceof Collision) return;

    const channel = c.collisionChannel;

    if(channel) {
      if(!this.collisonChannelExists(channel)) {
        console.error(`Channel ${channel} is not registered`);
        return;
      }

      this.collisions[channel].push(c);
    }
  }


  /**
   * 
   * @param {Collision} c 
   */
  removeCollision(c) {
    if(!c instanceof Collision) {
      console.error(c, "is not a collision");
      return;
    }

    const cList = this.collisions[c.collisionChannel];
    const removeIndex = cList.findIndex(item => item === c);

    if(removeIndex < 0) {
      console.error(c, "is not a regestered collision");
      return;
    }

    cList.splice(removeIndex, 1);
  }

  /**
   * 
   * @param {Mover} mover 
   * @param {Vector} hit 
   */
  reolverInfinite(mover, {normal, penetration}) {
    const normVelocity = Vector.dot(normal, mover.velocity);
    if (normVelocity > 0) return;

    const restitution = 1;

    const impulse = Vector.mult(normal, -(1 + restitution) * normVelocity * mover.mass)
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

      if(a.boundsCheck)
        a.collision.checkOutOfBounds(this.context, hit => this.reolverInfinite(a, hit));
    })
  }


  resolveCollisions() {
    //const array = this.pool.actors.filter(a => a.collision);
    //pairs(array, (a, b) => this.resolvePair(a.collision, b.collision));

    this.collisionResponses.forEach(({pair, response}) => {
      const [channelA, channelB] = pair;

      if(channelA === channelB) {
        pairs(
          this.collisions[channelA],
          (a, b) => this.resolvePair(a, b, response),
        );
      }
      else {
        doublePairs(
          this.collisions[channelA],
          this.collisions[channelB],
          (a, b) => this.resolvePair(a, b, response),
        );
      }
    });
  }


  /**
   * 
   * @param {Collision} a 
   * @param {Collision} b 
   */
  resolvePair(a, b, response) {
    const hit = this.staticCollision(a, b);
    //const response = this.getCollisionResponse(a, b);
  
    switch(response) {
      case CollisionResponse.PHYSIC: {
        if(hit) {
          if(!a.attachment instanceof Mover || !b.attachment instanceof Mover) return;
          this.resolver(a.attachment, b.attachment, hit);
          a.onHit(b.attachment, b, hit);
          b.onHit(a.attachment, a, hit);
        }
        break;
      }

      case CollisionResponse.OVERLAP: {
        if(hit) {
          //if(a.overlaps)
        }
        else {

        }
        break;
      }
    }
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


/**
 * @param {Array<T>} arrayA
 * @param {Array<T>} arrayB
 * @param {(a: T, b: T) => void} action
 */
function doublePairs(arrayA, arrayB) {
  arrayA.forEach(a => arrayB.forEach(b => action(a, b)));
}