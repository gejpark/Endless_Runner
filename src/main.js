/**
 * NAME: Gene Park
 * TITLE: ENDLESS RETURN
 * HOURS SPENT: 30
 * CREATIVE TILT JUSTIFICATION: 
 *          1. Used shaders for the background to simulate scrolling background. This required learning how Phaser 3's shader pipeline worked. It was quite a hassle. After learning how it worked, I got fragment shader code from the internet and translated + modified it so that it would work in Phaser 3. Citations below. (5)
 *          2. For the model of the spaceship, I wanted to use a new tool PICOCAD. While this allowed me to create a revolving gif of the spaceship, translating that into usable sprites was very difficult. Additionally, all art assets (except the shader background) use the PICO-8 color palette. (5)
 */
//CITATIONS:
//Shader for Play scene background: https://www.shadertoy.com/view/dlt3zs
//Music: https://pixabay.com/music/corporate-space-technologies-146694/
//PICOCAD: https://johanpeitz.itch.io/picocad
//PICO-8 Color Palette: https://lospec.com/palette-list/pico-8
//ASEPRITE: https://www.aseprite.org/
//SOUND EFFECTS FROM SFXR: https://sfxr.me/

let config = {
    type: Phaser.WEBGL, //Phaser.CANVAS => webgl isn't pixel perfect when rendering for some reason
    width: 640,
    height: 480,
    scene: [Menu, Play, Instructions, Scores, Credits],
    // canvas: myCustomCanvas,
    // context: myCustomContext,
    transparent: true, //activate transparency
    physics: {
        default: 'arcade',
        arcade: {
            debug: true, //turn off debug later. (set to false)
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    fps: { forceSetTimeOut: true, target: 60 },
}
let game = new Phaser.Game(config);
// reserve keyboard vars
let KEY_SPACE, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_Z;
let SCORES = [];
// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;