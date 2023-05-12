class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.VELOCITY = 400;
        // this.MAX_X_VEL = 1000;   // pixels/second
        // this.MAX_Y_VEL = 1000;
        // this.setMaxVelocity(500, 5000);
        // this.setDrag(10);    // Constant drag. FIXME: Change this behavior?
        this.MAX_JUMPS = 1; // change for double/triple/etc. jumps
        // this.JUMP_VELOCITY = -800;
        // scene.physics.world.gravity.y = 2600;
        // this.setGravityY(500);
        // this.setFlip(true, false);
        this.jumpApex = false;  //at apex of jump?
        this.jumping = false;   //is player in jumping state (collisions ignored when player jumping, only when touching down are collisions re-enabled.)
        this.lives = 3; //set lives.
    }

    preload() {

    }

    create() {

        //create spaceship animation
        this.anims.create({
            key: 'spaceship_forward',
            frames: this.anims.generateFrameNumbers('spaceship_forward', {start: 0, end: 2, first: 0}),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'spaceship_side',
            frames: this.anims.generateFrameNumbers('spaceship_side', {start: 0, end: 2, first: 0}),
            frameRate: 15,
            repeat: -1,
        })

        //play that animation on player.
        // this.anims.play('spaceship_forward', true);
        // this.anims.play('spaceship_side', true);


        this.y = game.config.height - this.height/2;
        this.x = game.config.width/2 - this.width/2;

    }

    update() {
        // console.log(this.width);
        // console.log(this.x);

        if(KEY_LEFT.isDown && this.x >= this.width/2) {
            // console.log("LEFT");
            this.body.setVelocityX(-this.VELOCITY * 2);
            this.resetFlip();
            this.anims.play('spaceship_side', true);
        } else if (KEY_RIGHT.isDown && this.x <= game.config.width - this.width/2) {
            // console.log("RIGHT");
            this.body.setVelocityX(this.VELOCITY * 2);
            this.setFlip(true, false);
            this.anims.play('spaceship_side', true);
        } else {
            this.anims.play('spaceship_forward', true);
            this.body.setVelocityX(0);
        }

        if(!this.jumpApex) { //if not jumpApex
            // console.log("HERE");
            if (KEY_SPACE.isDown && !this.jumping) {
                this.scene.sound.play('sfx_jump');
                this.body.setVelocityY(-this.VELOCITY);
                this.jumping = true;
            }
            if(this.y <= this.height/2) {    //at apex of jump, set jumpApex = true.
                // this.body.setVelocityY(0);
                this.jumpApex = true;
            }
        } else {
            if (this.y <= game.config.height - this.height/2) {
                this.body.setVelocityY(this.VELOCITY);
            } else {
                this.body.setVelocityY(0);
                this.y = game.config.height - this.height/2 * 1.1;
                this.jumping = false;
                this.jumpApex = false;
            }
        }

        //scale size with the current y location, makes it look like the player is jumping towards the camera.
        // console.log(this.scale);
        // this.setScale((game.config.height - this.height)/this.y);
        // this.setScale(Math.min((game.config.height - this.height)/this.y),1);
        
        // this.alpha = this.y/(game.config.height - this.height);

        // this.setScale(this.y/(game.config.height - this.height));   
    }

    detectOverlap(other) { //detects collision via hitbox overlap
        if (this.active && other.active) {
            this.scene.physics.add.overlap(other, this, () => {this.onCollision(other)}, null, this);
        }
    }

    onCollision(other) {
        if (this.active && other.active) {
            if (other.alpha > 0.9) {
                if (this.jumping && other.UP_OR_DOWN < 0) {
                    this.lives -= 1;
                    other.selfDestroy();
                }
                if (!this.jumping) {
                    this.lives -= 1;
                    other.selfDestroy();
                }
            }
        }
    }


}