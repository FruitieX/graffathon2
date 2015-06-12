function scenezero() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
};

scenezero.prototype.init = function() {
    curThreeScene = new THREE.Scene();
    camera.position.z = 5;
    curThreeScene.add(this.cube);
};

scenezero.prototype.deinit = function() {
};

scenezero.prototype.update = function(dt) {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
};
