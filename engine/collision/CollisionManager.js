import { Vector } from 'p5';
import Pool from '../core/Pool'
import Mover from '../core/Mover'
import {TraceMode, Collision, CollisionResponse, Circle, EngineCollisionChannel} from './Collision'
import * as Physics from './Physics'
import * as Mutuals from './Mutuals'
import {pairs, doublePairs} from './utils'



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


  /**
   * 
   * @param {string} id 
   * @returns {boolean}
   */
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

      if(!this.collisonChannelExists(idA))
        this.createCollisionChannel(idA, null);
      
      if(!this.collisonChannelExists(idB))
        this.createCollisionChannel(idB, null);

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
   */
  resolveCollisionBounds() {
    this.pool.actors.forEach(a => {
      if(!a.collision || !a instanceof Mover) return;

      if(a.physics.boundsCheck)
        a.collision.checkOutOfBounds(this.context, hit => Physics.resolveBoundCollision(a, hit));
    })
  }


  /**
   * 
   */
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
    // should ingore?
    if(a.collisionIgnore && a.collisionIgnore.includes(b)) return;
    if(b.collisionIgnore && b.collisionIgnore.includes(a)) return;

    const hit = this.staticCollision(a, b);
    //const response = this.getCollisionResponse(a, b);
  
    switch(response) {
      case CollisionResponse.PHYSIC: {
        if(hit) {
          if(!a.attachment instanceof Mover || !b.attachment instanceof Mover) return;

          Physics.resolveCollision(a.attachment, b.attachment, hit);

          a.onHit(b, hit);
          b.onHit(a, hit);
        }
        break;
      }

      case CollisionResponse.OVERLAP: {
        const alreadyOverlap = a.overlaps.includes(b);

        if(hit) {
          if(!alreadyOverlap) {
            a.overlaps.push(b);
            b.overlaps.push(a);

            a.onBeginOverlap(b, hit);
            b.onBeginOverlap(a, hit);            
          }
        }
        else {
          if(alreadyOverlap) {
            const removeA = a.overlaps.findIndex(i => i === b);
            a.overlaps.splice(removeA);

            const removeB = b.overlaps.findIndex(i => i === a);
            b.overlaps.splice(removeB);

            a.onEndOverlap(b, hit);
            b.onEndOverlap(a, hit);
          }
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
    // TODO

    return Mutuals.circleVScircle(a, b);
  }



  /**
   * 
   * @param {Vector} point 
   * @param {string} traceChannel
   */
  verticalTrace(point, traceChannel = null) {
    const res = [];
    let done = false;

    this.forEachCollision(c => {
      if(done) return;

      if(traceChannel) {
        const response = c.traceResponse[traceChannel] || c.traceResponse.default;

        if(response === TraceMode.BLOCK) done = true;
        if(response === TraceMode.IGNORE || response == null) return;
      }

      const hit = c.pointHit(point);
      if(hit) res.push({actor: c.attachment, collision: c, hit});
    })

    return res;
  }


  /**
   * 
   * @param {(c: Collision) => void} action 
   */
  forEachCollision(action) {
    Object.entries(this.collisions).forEach(([channel, list]) => 
      list.forEach(c => action(c))
    )
  }
}
