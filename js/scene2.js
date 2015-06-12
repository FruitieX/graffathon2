function Scene2() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
};

Scene2.prototype.init = function() {
    curThreeScene = new THREE.Scene();
    camera.position.z = 7;
    curThreeScene.add(this.cube);
};

Scene2.prototype.deinit = function() {
};

Scene2.prototype.update = function(dt) {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
};
