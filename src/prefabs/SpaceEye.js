class SpaceEye extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.VELOCITY = 100;
        if (Math.random() - 0.5 > 0) {
            this.UP_OR_DOWN = 1;    
        } else {
            this.UP_OR_DOWN = -1;
        }
        this.setScale(0);
        // this.UP_OR_DOWN = Math.random() - 0.5;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if(this.active == false) {
            return;
        }
    }

    create() {

    }

    movement(multiplier=1) {
        if (this.active) { //while active
            this.body.setVelocityY(this.VELOCITY * multiplier * this.UP_OR_DOWN);
            // this.body.setVelocityX(-this.VELOCITY);
            // console.log(this.alpha);
            // this.UP_OR_DOWN = -1;
            if (this.UP_OR_DOWN < 0) { //going down
                //adjust alpha and size as gets closer to foreground
                this.alpha = Math.min(Math.abs((game.config.height/2 - this.y)/(game.config.height/2)), 1) + 0.2;
                this.setScale(Math.min(Math.abs((game.config.height/2 - this.y)/(game.config.height/2)), 1));
            } else {
                this.alpha = Math.min(Math.abs((this.y-game.config.height/2)/(game.config.height/2)), 1)  + 0.2;
                this.setScale(Math.min(Math.abs((this.y-game.config.height/2)/(game.config.height/2)),1));
            }
            // this.UP_OR_DOWN *= -1;
            if(this.x < -this.width || this.x > game.config.width + this.width || this.y < -this.height || this.y > game.config.height + this.height) {
                this.destroy();
            }
        }
    }

    detectOverlap(other) { //detects collision via hitbox overlap, does not apply physics on each collider.
        if (this.active && other.active) {
            this.scene.physics.add.overlap(other, this, () => {this.onCollision(other)}, null, this);
            // this.scene.physics.add.overlap(other, this);
            // this.scene.physics.world.on('overlap', (this, other) => {
            //     this.onCollision(other);
            // });
        }
    }

    onCollision(other) {
        if (this.active && other.active && !other.jumping) {
            if (this.alpha > 0.85) { //alpha gets higher as enemy comes closer to foreground
                this.destroy();
            }
        }
        if (this.active && other.active && other.jumping && this.UP_OR_DOWN < 0) {
            //console.log("collided");
            if (this.alpha > 0.85) {
                this.destroy();
            }
        }
    }


    // detectCollision(other) { //detects collision via physics
    //     //other being player collider or attack
    //     if (this.active && other.active) { //check if gameobject is active during collision.
    //         console.log(other.jumping);
    //         if (!other.jumping) {
    //             this.scene.physics.add.collider(this, other, () => {
    //                 // console.log("collided");
    //                 this.selfDestroy();
    //             });
    //         }
    //     }
    // }

    selfDestroy() { //destroy self
        this.destroy();
    }
}