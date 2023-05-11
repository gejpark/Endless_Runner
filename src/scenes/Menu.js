class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        //load menu background
        this.load.image('menu_background', './assets/Sprites/background_sprite.png');

        //load base image for spaceship revolving animation
        this.load.image('spaceship_revolve_base', './assets/Sprites/spaceship_revolve_base.png');
        //load menu animation
        this.load.spritesheet('menu_background_animated', './assets/Sprites/menu_background.png', {frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 5});
        //load revolving spaceship spritesheet
        this.load.spritesheet('spaceship_revolve','./assets/Sprites/spaceship3-Sheet.png', {frameWidth: 90, frameHeight: 70, startFrame: 0, endFrame: 179});
    }

    create() {
        this.selected = 0;

        //create spaceship revolving animation.
        this.anims.create({
            key: 'spaceship_revolve',
            frames: this.anims.generateFrameNumbers('spaceship_revolve', {start: 0, end: 179, first: 0}),
            frameRate: 15,
            repeat: -1,
        });

        this.anims.create({
            key: 'menu_background_animated',
            frames: this.anims.generateFrameNumbers('menu_background_animated', {start: 0, end: 5, first: 0}),
            frameRate: 15,
        })

        this.menu_background = this.add.sprite(0,0,'menu_background').setOrigin(0,0);
        this.menu_background.anims.play('menu_background_animated', true);

        this.spaceship_revolve_base = this.add.sprite(0,0,'spaceship_revolve_base').setOrigin(0,0);
        this.spaceship_revolve_base.x = (game.config.width - this.spaceship_revolve_base.width)/2;
        this.spaceship_revolve_base.y = (game.config.height - this.spaceship_revolve_base.height)/2;
        

        this.spaceship_revolve_base.anims.play('spaceship_revolve', true);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '14px',
            // backgroundColor: '#816271',
            color: '#c3a38a',
            align: 'right',
            // padding: {
            //     top: 5,
            //     bottom: 5,
            // },
            fixedWidth: 0
        }
        this.playButton = this.add.text(game.config.width/2, game.config.height - (14)*3 - 100 , 'PLAY', menuConfig).setOrigin(0.5, 0);
        this.instructionButton = this.add.text(game.config.width/2, game.config.height - (14)*2 - 100, 'INSTRUCTIONS', menuConfig).setOrigin(0.5, 0);

        KEY_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        KEY_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        KEY_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        KEY_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        KEY_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // if (Phaser.Input.Keyboard.JustDown(KEY_RIGHT)) {
        //     this.scene.start('playScene');
        // }
        if(Phaser.Input.Keyboard.JustDown(KEY_DOWN)) {
            this.selected += 1;
            this.selected = this.selected % 2;
        }
        if(Phaser.Input.Keyboard.JustDown(KEY_UP)) {
            if(this.selected == 0) {
                this.selected = 1;
            } else {
                this.selected -= 1;
            }
            this.selected = this.selected % 2;
        }

        if(this.selected == 0) {
            this.playButton.setBackgroundColor('#816271'); //fill in color for selected button
            //deselect everything else.
            this.instructionButton.setBackgroundColor('rgba(0,0,0,0)');
            if (Phaser.Input.Keyboard.JustDown(KEY_SPACE)) {
                this.scene.start('playScene');
            }
        } else if (this.selected == 1) {
            this.instructionButton.setBackgroundColor('#816271');
            this.playButton.setBackgroundColor('rgba(0,0,0,0)');
        }
    }
}