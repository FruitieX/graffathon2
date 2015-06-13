function Scene2() {
    console.log("asd");
    this.numParticles = 7;
    this.gravityCenter = new THREE.Vector3(0, 0, 0);
    this.gravityConstant = 0.000001;
    this.dx = [];
    this.d2x = [];
    for (var i = 0; i < 7; i++) {
        this.dx.push(new THREE.Vector3(0,0,0));
        this.d2x.push(new THREE.Vector3(0,0,0));
    }

    this._sceneTime = 5000; // scene active time in ms
};

Scene2.prototype.init = function() {
    curThreeScene = new THREE.Scene();
    camera.position.z = 70;

    var particleGeometry = new THREE.Geometry();
    for (var i = 0; i < this.numParticles; i++) {
        particleGeometry.vertices.push(new THREE.Vector3(i * Math.random(), i, Math.random()));
    }
    var particleMaterial = new THREE.PointCloudMaterial({
        size: 1
    });
    this.particles = new THREE.PointCloud(particleGeometry, particleMaterial);

    curThreeScene.add(this.particles);
};

Scene2.prototype.deinit = function() {
};

Scene2.prototype.update = function(dt, t) {
    //this.particles.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.01);
    dt = dt;
    //console.log(dt);
    for (var i = 0; i < this.numParticles; i++) {
        this.particles.geometry.vertices[i].add(this.dx[i].clone().multiplyScalar(dt));
        this.particles.geometry.verticesNeedUpdate = true;
        this.dx[i].add(this.d2x[i].clone().multiplyScalar(dt));
        if (i == 0) {
            //console.log(this.d2x[i]);
        }
        var diff = this.gravityCenter.clone().sub(this.particles.geometry.vertices[i]);
        this.d2x[i] = diff.multiplyScalar(this.gravityConstant * (1- Math.random() * 0.1));
    }
    this.gravityCenter.x = Math.sin(audio.get(0).currentTime * 2);
    this.gravityCenter.y = Math.cos(audio.get(0).currentTime * 2);

};
