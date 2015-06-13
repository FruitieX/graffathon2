function Scene2() {
    console.log("asd");
    this.numParticles = 19;
    this.gravityCenter = new THREE.Vector3(0, 0, 0);
    this.gravityConstant = 0.0000001;
    this.dx = [];
    this.d2x = [];
    for (var i = 0; i < this.numParticles; i++) {
        this.dx.push(new THREE.Vector3(0,0,0));
        this.d2x.push(new THREE.Vector3(0,0,0));
    }

    this._sceneTime = 5000; // scene active time in ms
};

Scene2.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );

    curThreeScene = new THREE.Scene();
    camera.position.z = 70;

    var particleGeometry = new THREE.Geometry();
    for (var i = 0; i < this.numParticles; i++) {
        particleGeometry.vertices.push(new THREE.Vector3((Math.random() - 0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
        //particleGeometry.vertexColors[i] = 0xFFFFFF * Math.random();
    }
    var particleMaterial = new THREE.PointCloudMaterial({
        size: 1,
        //vertexColors:THREE.VertexColors
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
        this.d2x[i].z += (Math.random() - 0.5) * 0.1 * this.gravityConstant;
    }
    var time = audio.currentTime * 1000;
    this.gravityCenter.x = Math.sin(time * 0.1) * 10;
    this.gravityCenter.y = Math.cos(time * 0.1) * 10;
    var timeMod = time % 2000;
    if (timeMod > 1000) {
        this.gravityConstant = -0.000001;
    } else{
        this.gravityConstant = 0.000001;
    }

};
