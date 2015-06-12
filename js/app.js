'use strict';

var camera;
var renderer;

var numScenes = 1; // number of scenes
var scenes = []; // list of all scenes
var curScene; // currently selected scene in the demo
var curSceneNum = 0;
var curThreeScene = null;
var init = function() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    /*
    for (var i = 0; i < numScenes; i++) {
        scenes.push(new scene0());
    }
    */
    scenes.push(new scenezero());
    changeScene(0); // start with scene 0
};

var changeScene = function(num) {
    // deinit old scene
    if (curScene) {
        curScene.deinit();
    }

    // init next scene
    curScene = scenes[num];
    console.log(curScene);
    curScene.init();
};

var render = function() {
    requestAnimationFrame( render );

    curScene.update();

    renderer.render(curThreeScene, camera);
};

$(document).ready(function() {
    init();
    render();
})
