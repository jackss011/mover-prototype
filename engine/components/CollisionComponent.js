import Component from "../core/Component";
import { Collision } from "../collision/Collision";


export class CollisionComponent extends Component {
  constructor(collision) {
    super();

    /** @type {Collision} */
    this._collision = collision;
    
  }


  /** @returns {Collision} */
  get get() {
    return this._collision;
  }


  init() {
    this.get.attachment = this.actor;
    this.actor.registerCollision(this.get);
  }


  onDestroy() {
    super.onDestroy();

    this.actor.unregisterCollision(this.get);
  }
}