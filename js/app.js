'use strict';

var camera;
var renderer;

var audio;

var numScenes = 3; // number of scenes
var scenes = []; // list of all scenes
var scenesElapsedTime = 0; // added to after each scene change, time since start of demo
var curScene = -1;
var curThreeScene = null;
var curTime = 0;

var init = function() {
    $(document).keypress(function(event) {
        if (event.which >= 48 && event.which <= 57) {
            changeScene(event.which - 48);
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
    audio = $('#audio');
    audio.trigger('play');
    audio.get(0).muted = true;
};

var changeScene = function(num) {
    // check that scene exists
    if (num > numScenes - 1) {
        return;
    }

    // deinit old scene
    if (scenes[curScene]) {
        scenes[curScene].deinit();
        scenesElapsedTime += scenes[curScene]._sceneTime;
    }

    // init next scene
    curScene = num;
    scenes[curScene].init();
    scenes[curScene]._startTime = curTime;
    console.log('scene changed to ' + num);
};

var shouldChangeScene = function() {
    // are we at the last scene?
    if (curScene === numScenes - 1) {
        return false
    }

    // has enough time passed?
    if (curTime > scenesElapsedTime + scenes[curScene]._sceneTime) {
        return true;
    }

    return false;
};

var prevFrame = new Date();
var render = function() {
    requestAnimationFrame(render);
    curTime = audio.get(0).currentTime * 1000;

    if (shouldChangeScene()) {
        changeScene(curScene + 1);
    }

    scenes[curScene].update(curTime - prevFrame);

    renderer.render(curThreeScene, camera);
};

$(document).ready(function() {
    init();
    render();
});
