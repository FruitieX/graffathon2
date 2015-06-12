function Scene0() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
};

Scene0.prototype.init = function() {
    curThreeScene = new THREE.Scene();
    camera.position.z = 5;
    curThreeScene.add(this.cube);
};

Scene0.prototype.deinit = function() {
};

Scene0.prototype.update = function(dt) {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
};
