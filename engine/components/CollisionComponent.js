import Component from "../core/Component";
import { Collision } from "../collision/Collision";


export class CollisionComponent extends Component {
  constructor(collision) {
    super();

    /** @type {Collision} */
    this._collision = collision;
    
  }


  /** @returns {Collision} */
  get collider() {
    return this._collision;
  }


  init() {
    super.init();
    
    this.collider.attachment = this.actor;
  }


  begin() {
    super.begin();
    
    this.actor.registerCollision(this.collider);
  }


  onDestroy() {
    super.onDestroy();

    this.actor.unregisterCollision(this.collider);
  }
}