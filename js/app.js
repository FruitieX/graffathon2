'use strict';

var camera;
var renderer;

var numScenes = 2; // number of scenes
var scenes = []; // list of all scenes
var curScene; // currently selected scene in the demo
var curSceneNum = 0;
var curThreeScene = null;
var init = function() {
    $(document).keypress(function(event) {
        if (event.which >= 49 && event.which <= 51) {
            changeScene(event.which - 49);
        }
    })
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    for (var i = 0; i < numScenes; i++) {
        scenes.push(new window['Scene' + i]());
    }
    changeScene(0); // start with scene 0
};

var changeScene = function(num) {
    // deinit old scene
    if (curScene) {
        curScene.deinit();
    }

    // init next scene
    curScene = scenes[num];
    curScene.init();
    curSceneNum = num;
};

var render = function() {
    requestAnimationFrame(render);

    curScene.update();

    renderer.render(curThreeScene, camera);
};

$(document).ready(function() {
    init();
    render();
});
