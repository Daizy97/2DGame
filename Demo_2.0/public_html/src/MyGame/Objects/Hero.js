/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteRenderable, RigidCircle, RigidRectangle, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture, atX, atY) {
    this.kXDelta = 1;
    this.kYDelta = 2.0;
    
    this.moveSpeed = 45;
    this.moveSpeed_Max;
    this.moveSpeed_Min;
    
    this.jumpSpeed = 75;
    this.isGrounded = false;
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(4, 10);
    this.mDye.setElementPixelPositions(0, this.mDye.getTextureWidth(), 0, this.mDye.getTextureHeight());
    GameObject.call(this, this.mDye);
    var r = new RigidRectangle(this.getXform(), this.mDye.getXform().getWidth(), this.mDye.getXform().getHeight());
    r.setMass(0.5);  // less dense than Minions
    r.setRestitution(0.3);
    r.setColor([0, 1, 0, 1]);
    r.setDrawBounds(true);
    this.setPhysicsComponent(r);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function (dyePacks, platforms, allParticles, func) {
    // must call super class update
    GameObject.prototype.update.call(this);

    // control by WASD
    var v = this.getPhysicsComponent().getVelocity();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up) && this.isGrounded) {
        v[1] = this.jumpSpeed;
    }
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left) || gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
            v[0] = -1 * this.moveSpeed;
        }
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
            v[0] = this.moveSpeed;
        }
    }
    //  no horizontal input, but still moving
    else {
        if(Math.abs(v[0]) > 0.2) {
            //  moving right, v[0] > 0
            if(Math.sign(v[0] > 0)){
                v[0] -= 1.5;    //  decrease the speed value to around 0
            } 
            //  moving left, v[0] < 0
            else{
                v[0] += 1.5;    //  increase the value value to around 0
            }
        }
    }
    
    // now interact with the dyePack ...
//    var i, obj, collisionPt = [0, 0];
//    
//    var p = this.getXform().getPosition();
//    for (i=0; i<dyePacks.size(); i++) {
//        obj = dyePacks.getObjectAt(i);
//        // chase after hero
//        obj.rotateObjPointTo(p, 0.8);
//        if (obj.pixelTouches(this, collisionPt)) {
//            dyePacks.removeFromSet(obj);
//            allParticles.addEmitterAt(collisionPt, 200, func);
//        }
//    
    
    for(var i = 0; i < platforms.size(); i++){
        var platform = platforms.getObjectAt(i);
        var yDis = this.getXform().getYPos() - platform.getXform().getYPos();
        var xDis = this.getXform().getXPos() - platform.getXform().getXPos();
        if(Math.abs(xDis) <= platform.getXform().getWidth() / 2)
            if(yDis > 0 && yDis <= 6.5) {
                this.isGrounded = true;
                break;
            } else {
                this.isGrounded = false;
        }
    }
};