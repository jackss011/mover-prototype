import { Vector } from "p5";

export default class Mover
{
    constructor() {
        this.position = new Vector();
        this.velocity = new Vector();
        this.cumulatedForces = new Vector();
        this.cumulatedImpulse = new Vector();
        this.pool = null;
    }

    begin() {}

    tick(delta, st) {
        this.velocity.add(this.cumulatedForces.mult(delta));
        this.cumulatedForces.set(0, 0);

        this.velocity.add(this.cumulatedImpulse);
        this.cumulatedImpulse.set(0, 0);

        this.position.add(this.velocity);
    }

    applyForce(force) {
        this.cumulatedForces.add(force);
    }

    applyImpulse(impulse) {
        this.cumulatedImpulse.add(impulse);
    }
}