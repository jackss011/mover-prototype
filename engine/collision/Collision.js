import p5, { Vector } from "p5";

import Actor from "../core/Actor";
//import Mover from "../core/Mover";


export const CollisionType = Object.freeze({
  CIRCLE: 'CIRCLE',
});



export const CollisionResponse = Object.freeze({
  IGNORE: 'IGNORE',
  PHYSIC: 'PHYSIC',
  OVERLAP: 'OVERLAP',
});


export const EngineCollisionChannel = Object.freeze({
  DEFAULT: "ENGINE_DEFAULT",
});


export const TraceMode = Object.freeze({
  IGNORE: 'IGNORE',
  PASS: 'PASS',
  BLOCK: 'BLOCK',
});



export class Collision {
  constructor() {
    /** @type {string} */
    this.type = null;

    /** @type {Actor} */
    this.attachment = null;


    this.traceResponse = {default: TraceMode.IGNORE};

    /** @type {string} */
    this.collisionChannel = EngineCollisionChannel.DEFAULT;


    this.restitution = 0.4;


    /**@type {(Mover, Collision) => void} */
    this.onHitHandler = null;

    /**@type {(Actor, Collision) => void} */
    this.onBeginOverlapHandler = null;

    /**@type {(Actor, Collision) => void} */
    this.onBeginOverlapHandler = null;
  }


  get TraceMode() {
    return TraceMode;
  }


  get position() {
    if(this.attachment) 
      return this.attachment.position;

    return new Vector();
  }


  /**
   * @param {p5} context 
   * @param {(hit: {normal:Vector, penetration:number}) => void} resolver 
   */
  checkOutOfBounds(context, resolver) {
    return false;
  }


  /**
   * 
   * @param {Vector} point 
   */
  pointHit(point) {
    return false;
  }


  /**
   * 
   * @param {Mover} mover 
   * @param {Collision} collision 
   */
  onHit(mover, collision, hit) {
    if(this.onHitHandler)
      this.onHitHandler(mover, collision, hit)
  }


  /**
   * 
   * @param {Actor} actor 
   * @param {Collision} collision 
   */
  onBeginOverlap(actor, collision, hit) {
    if(this.onBeginOverlap)
      this.onBeginOverlap(actor, collision, hit)
  }


  /**
   * 
   * @param {Actor} actor 
   * @param {Collision} collision 
   */
  onEndOverlap(actor, collision, hit) {
    if(this.onEndOverlap)
      this.onEndOverlap(actor, collision, hit)
  }
}



export class Circle extends Collision {
  /**
   *
   * @param {number} radius 
   */
  constructor(radius) {
    super();

    this.type = CollisionType.CIRCLE;
    this.radius = radius;
  }


  /**
   * @param {p5} context 
   * @param {(hit: {normal:Vector, penetration:number}) => void} resolver 
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
