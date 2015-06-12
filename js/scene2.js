function Scene2() {
    this.numParticles = 7;
    this.dx = [];
    for (var i = 0; i < 7; i++) {
        this.dx.push(new THREE.Vector3(0,0,0));
    }

    this._sceneTime = 5000; // scene active time in ms
};

Scene2.prototype.init = function() {
    curThreeScene = new THREE.Scene();
    camera.position.z = 7;

    var particleGeometry = new THREE.Geometry();
    for (var i = 0; i < this.numParticles; i++) {
        particleGeometry.vertices.push(new THREE.Vector3(0, i, 0));
    }
    var particleMaterial = new THREE.PointCloudMaterial({
        size: 1
    });
    this.particles = new THREE.PointCloud(particleGeometry, particleMaterial);

    curThreeScene.add(this.particles);
};

Scene2.prototype.deinit = function() {
};

Scene2.prototype.update = function(dt) {
    //this.particles.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.01);
    for (var i = 0; i < this.numParticles; i++) {
        this.particles.geometry.vertices[i].add(this.dx[i]);
        this.particles.geometry.verticesNeedUpdate = true;
        this.dx[i] = this.particles.geometry.vertices[i].multiplyScalar(-1);
    }

};
