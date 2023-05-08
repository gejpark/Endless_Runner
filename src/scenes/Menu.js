class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {

    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Trebuchet MS',
            fontSize: '28px',
            backgroundColor: '#816271',
            color: '#c3a38a',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'ENDLESS_RUNNER', menuConfig).setOrigin(0.5);

        KEY_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        KEY_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start('playScene');
        }
    }
}