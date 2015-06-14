'use strict';

// global variables (are beautiful)

var camera;
var renderer;
var composer;
var canvas;
var canvasCtx;

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

var sceneStartTime = 0;
var scenes = []; // list of all scenes

var sceneOrder = [
    {num: 0, sceneTime: barCycle * 8},
    {num: 1, sceneTime: barCycle * 8},
    {num: 2, sceneTime: barCycle * 8},
    {num: 3, sceneTime: barCycle * 8},
    {num: 4, sceneTime: barCycle * 8},
    {num: 5, sceneTime: barCycle * 8},
    {num: 6, sceneTime: barCycle * 8},
    {num: 7, sceneTime: barCycle * 8},
    {num: 8, sceneTime: barCycle * 8},
    {num: 9, sceneTime: barCycle * 4},
    {num: 10, sceneTime: barCycle * 4},
    {num: 11, sceneTime: barCycle * 4},
    {num: 12, sceneTime: barCycle * 4},
    {num: 13, sceneTime: barCycle * 8},
    {num: 14, sceneTime: barCycle * 8},
    {num: 15, sceneTime: barCycle * 8},
    {num: 16, sceneTime: barCycle * 8},
    {num: 17, sceneTime: barCycle * 16},
    {num: 18, sceneTime: barCycle * 8}
];

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
    renderer.domElement.style.position = 'absolute';
    document.body.appendChild(renderer.domElement);

    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style['z-index'] = 9999;
    canvasCtx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    function onWindowResize() {
        width = window.innerWidth;
        height = window.innerHeight;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.removeEventListener('resize', onWindowResize, false);
    window.addEventListener('resize', onWindowResize, false);
};

var init = function() {
    $(document).keypress(function(event) {
        console.log(event.which);
        if (event.which >= 48 && event.which <= 57) {
            // 0 .. 9
            if (!debugMode) {
                console.warn('manual scene change triggered, debug mode active');
            }
            debugMode = true;
            changeScene(event.which - 48);
        } else if (event.which >= 97 && event.which <= 122) {
            // a .. z
            if (!debugMode) {
                console.warn('manual scene change triggered, debug mode active');
            }
            debugMode = true;
            changeScene(event.which - 97 + 10);
        }
    })
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    initRenderer();

    for (var i = 0; i < sceneOrder.length; i++) {
        console.log('loading scene: ' + i);
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
    if (num > sceneOrder.length - 1) {
        return;
    }

    // deinit old scene
    if (curScene !== -1) {
        var oldScene = scenes[sceneOrder[curScene].num];
        oldScene.deinit();
        scenesElapsedTime += sceneOrder[curScene].sceneTime;
    }
    composer = null;

    // init next scene
    curScene = num;

    var newScene = scenes[sceneOrder[curScene].num];
    newScene.init();
    sceneStartTime = curTime;
    console.log('scene changed to ' + num);
};

var shouldChangeScene = function() {
    // debug mode on or are we at the last scene?
    if (debugMode) {
        return false;
    }
    if (curScene === sceneOrder.length - 1) {
        return false;
    }

    // has enough time passed?
    if (curTime > scenesElapsedTime + sceneOrder[curScene].sceneTime) {
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
    curTime = 0 + audio.currentTime * 1000;

    if (shouldChangeScene()) {
        changeScene(curScene + 1);
    }

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
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
