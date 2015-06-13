function Scene0() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

    // fft init
    /*
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    var bufferLength = this.analyser.frequencyBinCount;
    this.fftResult = new Uint8Array(bufferLength);
    */

    this.cube = new THREE.Mesh( geometry, material );
    this._sceneTime = 5000; // scene active time in ms
};

Scene0.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 5;
    curThreeScene.add(this.cube);

    /*
    this.source = this.audioCtx.createMediaElementSource(audio);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
    */
};

Scene0.prototype.deinit = function() {
};

Scene0.prototype.update = function(dt) {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
};
