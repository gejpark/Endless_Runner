class Shot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setX = this.x;
        this.setX = this.x - this.width/2;
        // this.end = new Phaser.Math.Vector4(this.setX, 480/2, 0, 0);
        // this.end = new Phaser.Math.Vector4(this.x - this.width/2, 480/2, 0, 0);
        this.end = new Phaser.Geom.Point(this.x, 480/2);
        this.start = new Phaser.Geom.Point(this.x, this.y);
        this.current = this.start;
        this.move = 0;
    }
    
    fire() {
        if (this.active) {
            // this.end = new Phaser.Math.Vector4(this.setX, 480/2, 0, 0);
            // this.setScale(1-this.move);
            // this.body.position.lerp(this.end, this.move);
            this.current = Phaser.Geom.Point.Interpolate(this.start, this.end, this.move);
            
            // console.log(this.current);
            this.y = this.current.y;
            
            this.move += 0.05;
            this.setScale(1-this.move);
            if(this.move >= 1) {
                this.destroy();
            }
        }
    }

    detectOverlap(other) {
        if(this.active && other.active) {
            this.scene.physics.add.overlap(other, this, () => {this.onCollision(other)}, null, this);
        }
    }

    onCollision(other) {
        if (this.active) {
            if(other.active) {
                other.selfDestroy();
            }
            this.destroy();
        }
    }
}