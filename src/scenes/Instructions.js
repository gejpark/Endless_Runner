class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionsScene');
    }
    preload() {
        this.load.image('instructions_background', './assets/Sprites/instructions_background.png');

        //load player stuff
        this.load.image('player_base_sprite', './assets/Sprites/player_base_sprite.png');       //base sprite should have same dimesions as frameWidth + frameHeight
        this.load.spritesheet('spaceship_forward','./assets/Sprites/spaceship_forward1.png', {frameWidth: 96, frameHeight: 80, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_side', './assets/Sprites/spaceship_side1.png', {frameWidth: 113, frameHeight: 85, startFrame: 0, endFrame: 2});

        //load projectile
        this.load.image('Shot', './assets/Sprites/shot.png');

        //load enemy stuff
        this.load.image('SpaceEye', './assets/Sprites/large_space_eye.png');
    }
    create() {
        

        KEY_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        KEY_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        KEY_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        KEY_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        KEY_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        KEY_Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.menu_background = this.add.sprite(0,0,'instructions_background').setOrigin(0,0);
        this.spaceship_revolve_base = this.add.sprite(game.config.width,0,'spaceship_revolve_base').setOrigin(1,0);
        if (!this.anims.exists('spaceship_revolve')) { //check if animation already exists
            this.anims.create({
                key: 'spaceship_revolve',
                frames: this.anims.generateFrameNumbers('spaceship_revolve', {start: 0, end: 179, first: 0}),
                frameRate: 15,
                repeat: -1,
            });
        }
        this.spaceship_revolve_base.anims.play('spaceship_revolve', true);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '14px',
            // backgroundColor: '#816271',
            color: '#FFF1E8',
            align: 'right',
            // padding: {
            //     top: 5,
            //     bottom: 5,
            // },
            fixedWidth: 0
        }
        this.intro = this.add.text(game.config.width/2,0, `WELCOME TO ENDLESS RETURN!`,menuConfig).setOrigin(0.5,0);
        this.one = this.add.text(0,this.intro.height, `MOVE LEFT: ←`,menuConfig).setOrigin(0,0);
        this.two = this.add.text(0,this.intro.height*2, `MOVE RIGHT: →`,menuConfig).setOrigin(0,0);
        this.three = this.add.text(0,this.intro.height*3, `GO FASTER WITH: ↑ (MORE SCORE INCREASE)`,menuConfig).setOrigin(0,0);
        this.four = this.add.text(0,this.intro.height*4, `GO SLOWER WITH: ↑ (LESS SCORE INCREASE)`,menuConfig).setOrigin(0,0);
        this.five = this.add.text(0,this.intro.height*5, `LAZER ATTACK WITH: Z`,menuConfig).setOrigin(0,0);
        this.six = this.add.text(0,this.intro.height*6, `JUMP WITH: SPACE`,menuConfig).setOrigin(0,0);
        this.seven = this.add.text(game.config.width/2,this.intro.height*7, `[DESTROY ENEMY TO RETURN TO MENU]`,menuConfig).setOrigin(0.5,0);

        // this.movement_forward = this.add.text(0,this.intro.height*2, `GO FASTER WITH ↑ AND SLOWER WITH ↓.`,menuConfig).setOrigin(0,0);
        // this.movement_forward_explanation = this.add.text(0,this.intro.height*3, `GOING FASTER GIVES YOU MORE SCORE. GOING SLOWER GIVES YOU LESS SCORE`,menuConfig).setOrigin(0,0);
        
        this.enemy = new SpaceEye(this, game.config.width/2, game.config.height/2, 'SpaceEye').setOrigin(0.5,0.5);
        this.enemy.setScaler(1);
        this.player = new Player(this, game.config.width/2, game.config.height/2, 'player_base_sprite').setOrigin(0.5,0.5);
        this.player.create();
        this.menu_background.setDepth(this.player.depth - 1);
        this.projectile_timer = 101;
        this.projectile_list = [];
    }

    update() {
        // this.enemy = new SpaceEye(this, game.config.width/2, game.config.height/2, 'SpaceEye').setOrigin(0.5,0.5);
        // this.enemy.movement(0);
        if(this.enemy.active == false) {
            this.scene.start('menuScene');
        }

        this.player.update(); //player update (controls movement)
        this.projectile_timer += 1;
        if(KEY_Z.isDown && this.projectile_timer > 100) {
            this.projectile_list.push(new Shot(this, this.player.x, this.player.y - this.player.height/2, 'Shot').setOrigin(0.5).setDepth(this.player.depth - 1));
            this.sound.play('sfx_shot');
            this.projectile_timer = 0;
        }
        this.projectile_list.forEach(projectile => {
            // projectile.z = this.player.w + 1;
            projectile.fire();
            projectile.detectOverlap(this.enemy);
            // this.enemy_list.forEach(enemy => {
            //     projectile.detectOverlap(enemy);
            // });
        });
    }
}