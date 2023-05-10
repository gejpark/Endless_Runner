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
        this.JUMP_VELOCITY = -800;
        // scene.physics.world.gravity.y = 2600;
        // this.setGravityY(2600);
        // this.setFlip(true, false);
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

        //play that animation on player.
        this.anims.play('spaceship_forward', true);


        this.y = game.config.height - this.height;
        this.x = game.config.width/2 - this.width/2;

    }

    update() {
        // console.log(this.width);
        // console.log(this.x);

        if(KEY_LEFT.isDown && this.x >= 0) {
            // console.log("LEFT");
            this.body.setVelocityX(-this.VELOCITY);
        } else if (KEY_RIGHT.isDown && this.x <= game.config.width - this.width) {
            // console.log("RIGHT");
            this.body.setVelocityX(this.VELOCITY);
        } else {
            this.body.setVelocityX(0);
        }

        
    }


}