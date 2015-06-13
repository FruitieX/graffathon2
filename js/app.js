'use strict';

// global variables (are beautiful)

var camera;
var renderer;
var composer;

var width = window.innerWidth;
var height = window.innerHeight;

var debugMode = false;
var bpm = 172;

// time between bars ( = 4 beats)
var barCycle = 1000 / (bpm / 60) * 4;

var audio;
var audioCtx;
var analyser;
var source;
var fftResult;
//var fftTempResult;
var bass = 0;
var _bass = 0;
var snare = 0;
var _snare = 0;

var numScenes = 6; // number of scenes
var scenes = []; // list of all scenes
var scenesElapsedTime = 0; // added to after each scene change, time since start of demo
var curScene = -1;
var curThreeScene = null;
var curTime = 0;

audio = new Audio();
audio.src = '/music.mp3';

$(document).ready(function() {
    document.body.appendChild(audio);
});

var initRenderer = function() {
    composer = null;
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.innerHTML = '';
    document.body.appendChild(renderer.domElement);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.removeEventListener('resize', onWindowResize, false);
    window.addEventListener('resize', onWindowResize, false);
};

var init = function() {
    $(document).keypress(function(event) {
        if (event.which >= 48 && event.which <= 57) {
            debugMode = true;
            changeScene(event.which - 48);
        }
    })
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    initRenderer();

    for (var i = 0; i < numScenes; i++) {
        scenes.push(new window['Scene' + i]());
    }

    // fft init
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    var bufferLength = analyser.frequencyBinCount;
    //fftResult = Array.apply(null, new Array(bufferLength)).map(Number.prototype.valueOf, 0);
    fftResult = new Float32Array(bufferLength);
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    audio.play();
    changeScene(0); // start with scene 0
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
    composer = null;

    // init next scene
    curScene = num;
    scenes[curScene].init();
    scenes[curScene]._startTime = curTime;
    console.log('scene changed to ' + num);
};

var shouldChangeScene = function() {
    // debug mode on or are we at the last scene?
    if (debugMode || curScene === numScenes - 1) {
        return false
    }

    // has enough time passed?
    if (curTime > scenesElapsedTime + scenes[curScene]._sceneTime) {
        return true;
    }

    return false;
};

var fft = function() {
    var fftAvg = 0.35;
    analyser.getFloatFrequencyData(fftResult);
    /*
    _.each(fftTempResult, function(band, index) {
        fftResult[index] = fftResult[index] * fftAvg + band * (1 - fftAvg);
    });
    */

    var bassBand = 4;

    _bass = Math.min(100, Math.max(0, fftResult[bassBand] + 100) * 1.5) / 100;
    _bass = Math.exp(_bass) / Math.E;
    bass = bass * fftAvg + _bass * (1 - fftAvg);

    var snareBand = 40;

    _snare = Math.min(100, Math.max(0, fftResult[snareBand] + 100) * 1.5) / 100;
    _snare = Math.exp(_snare) / Math.E;
    snare = snare * fftAvg + _snare * (1 - fftAvg);
};

var prevFrame = 0;
var render = function() {
    requestAnimationFrame(render);
    fft();
    curTime = 100 + audio.currentTime * 1000;

    if (shouldChangeScene()) {
        changeScene(curScene + 1);
    }

    scenes[curScene].update(curTime - prevFrame, curTime);
    prevFrame= curTime;

    if (composer) {
        composer.render();
    } else {
        renderer.render(curThreeScene, camera);
    }
};

window.addEventListener('load', function(e) {
    init();
    render();
}, false);
