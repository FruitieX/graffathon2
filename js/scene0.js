function() scene0 {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
};

scene0.prototype.init = function() {
    curThreeScene = new THREE.Scene();
    camera.position.z = 5;
    scene.add(this.cube);
};

scene0.prototype.deinit = function() {
};

scene0.prototype.update = function(dt) {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
};

scenes.push(scene0);
