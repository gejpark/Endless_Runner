/**
 * NAME: Gene Park
 * TITLE: ???
 * HOURS SPENT: ???
 * CREATIVE TILT JUSTIFICATION: ???
 */
//CITATIONS:
//Shader for Play scene background: https://www.shadertoy.com/view/dlt3zs

// const contextCreationConfig = {
//     alpha: false,
//     depth: false,
//     antialias: true,
//     premultipliedAlpha: true,
//     stencil: true,
//     preserveDrawingBuffer: false,
//     failIfMajorPerformanceCaveat: false,
//     powerPreference: 'default'
// };


// const myCustomCanvas = document.createElement('canvas');
// const myCustomContext = myCustomCanvas.getContext('webgl2', contextCreationConfig);
let config = {
    type: Phaser.WEBGL, //Phaser.CANVAS => webgl isn't pixel perfect when rendering for some reason
    width: 640,
    height: 480,
    scene: [Menu, Play],
    // canvas: myCustomCanvas,
    // context: myCustomContext,
    // transparent: true, //activate transparency
}
let game = new Phaser.Game(config);
// reserve keyboard vars
let KEY_SPACE, KEY_LEFT, KEY_RIGHT;
// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;