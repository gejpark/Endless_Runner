class SpaceEye extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.VELOCITY = 100;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if(this.active == false) {
            return;
        }
    }

    create() {

    }

    update() {
        if (this.active) { //while active
            this.body.setVelocityY(this.VELOCITY);
            // this.body.setVelocityX(-this.VELOCITY);
            // this.setScale((game.config.height - this.height)/this.y);
            this.setScale(this.y/(game.config.height - this.height));
            if(this.x < -this.width || this.x > game.config.width + this.width || this.y > game.config.height + this.height) {
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
            this.destroy();
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