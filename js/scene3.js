function Scene3() {
    this.numParticles = 190;
    this.gravityCenter = new THREE.Vector3(0, 0, 0);
    this.gravityConstant = 0.0000001;
    this.dx = [];
    this.d2x = [];
    this.lastBass = 0;
    for (var i = 0; i < this.numParticles; i++) {
        this.dx.push(new THREE.Vector3(0,0,0));
        this.d2x.push(new THREE.Vector3(0,0,0));
    }

    this._sceneTime = barCycle * 8; // scene active time in ms
};

Scene3.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );

    // Add objects
    curThreeScene = new THREE.Scene();
    camera.position.z = 70;

    var particleGeometry = new THREE.Geometry();
    for (var i = 0; i < this.numParticles; i++) {
        particleGeometry.vertices.push(new THREE.Vector3((Math.random() - 0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10));
        particleGeometry.colors.push(new THREE.Color(0xFFFFFF * Math.random()));// * Math.random());
    }
    var particleMaterial = new THREE.PointCloudMaterial({
     size: 1,
     vertexColors:THREE.VertexColors
    });
    /*var particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            bass: {type: "f", value: bass},
        },

        vertexShader: document.getElementById("");
    };*/
    this.particles = new THREE.PointCloud(particleGeometry, particleMaterial);

    curThreeScene.add(this.particles);
};

Scene3.prototype.deinit = function() {
    renderer.shadowMapEnabled = false;
};

Scene3.prototype.update = function(dt, t) {
    //this.particles.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.01);
    dt = dt;
    var time = audio.currentTime * 1000;
    //console.log(dt);
    var is_bass = (bass > 0.95) && ((time - this.lastBass) > 400);
    if (is_bass) {
        this.lastBass = time;
    }
    for (var i = 0; i < this.numParticles; i++) {
        this.particles.geometry.vertices[i].add(this.dx[i].clone().multiplyScalar(dt));
        this.particles.geometry.verticesNeedUpdate = true;
        this.dx[i].add(this.d2x[i].clone().multiplyScalar(dt));
        if (i == 0) {
            //console.log(this.d2x[i]);
        }
        var diff = this.gravityCenter.clone().sub(this.particles.geometry.vertices[i]);
        var dir = diff.clone().normalize();
        var str = diff.length();
        this.d2x[i] = dir.clone().multiplyScalar(str * this.gravityConstant * (1- Math.random() * 0.1));
        this.d2x[i].z += (Math.random() - 0.5) * 0.1 * this.gravityConstant;

        if (is_bass) {
            this.dx[i].add(dir.clone().multiplyScalar(-0.010));
        }
    }

    this.gravityCenter.x = Math.sin(time * 0.1) * 5;
    this.gravityCenter.y = Math.cos(time * 0.1) * 5;
    var timeMod = time % 2000;
};
