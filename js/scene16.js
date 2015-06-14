function Scene16() {
    this.numParticles = 2048;
    this.maxSpeed = 0.01;
    this.gravityCenter = new THREE.Vector3(0, 0, 0);
    this.lightpos = new THREE.Vector3(0, 0, 0);
    this.gravityConstant = 0.0001;
    this.dx = [];
    this.d2x = [];
    this.m = [];
    this.lastBass = 0;
    for (var i = 0; i < this.numParticles; i++) {
        this.dx.push(new THREE.Vector3(0,0,0));
        this.d2x.push(new THREE.Vector3(0,0,0));
        this.m.push(0.1 + Math.random() * 0.9);
    }
};

Scene16.prototype.init = function() {
    this.hue1 = 0;
    this.hue2 = 180;
    camera = new THREE.PerspectiveCamera( 85, window.innerWidth/window.innerHeight, 0.1, 1000 );

    this.map = THREE.ImageUtils.loadTexture('isoparticle.png');
    //this.map.minFilter = THREE.NearestFilter;

    // Add objects
    curThreeScene = new THREE.Scene();
    camera.position.z = 14;

    var particleGeometry = new THREE.Geometry();
    for (var i = 0; i < this.numParticles; i++) {
        particleGeometry.vertices.push(new THREE.Vector3((Math.random() - 0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
        particleGeometry.colors.push(new THREE.Color(0xFFFFFF * Math.random()));// * Math.random());
    }
    var particleMaterial = new THREE.PointCloudMaterial({
        size: 0.5,
        map: this.map,
        transparent: true,
        vertexColors:THREE.VertexColors
    });

    this.particles = new THREE.PointCloud(particleGeometry, particleMaterial);

    var planeGeom = new THREE.PlaneBufferGeometry(1000, 1000);
    //var planeMaterial = new THREE.MeshBasicMaterial();
    this.uniforms = {
        bass: {type: "f", value: bass},
        lightPos: {type: "v3", value: new THREE.Vector3(0,0,0)},
        resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };
    this.attributes = {
        vertexPosition: {type: "v3", values: particleGeometry.vertices},
    }
    var unif = this.uniforms;
    var attrib = this.attributes;
    var planeMaterial = new THREE.ShaderMaterial({
        uniforms: unif,
        attributes: attrib,
        vertexShader: document.getElementById("scene3vs").textContent,
        fragmentShader: document.getElementById("scene3fs").textContent,
    });
    this.plane = new THREE.Mesh(planeGeom, planeMaterial);

    curThreeScene.add(this.particles);
    curThreeScene.add(this.plane);

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    this.hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    composer.addPass(this.hblur);
    this.hblur.renderToScreen = true;
};

Scene16.prototype.deinit = function() {
    renderer.shadowMapEnabled = false;
};

Scene16.prototype.update = function(dt, t) {
    //this.particles.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.01);
    dt = dt;
    this.hue1 = (this.hue1 + bass * 1) % 360;
    this.hue2 = (this.hue2 + bass * 1) % 360;
    this.lightness = 7* bass;

    var cycle = barCycle / 2;

    var lightness1 = 5;

    var color_s1 = 'hsl(' + this.hue1 + '%, 100%, ' + lightness1 + '%)';
    var color1 = tinycolor(color_s1).toRgb();

    var color_s2 = 'hsl(' + this.hue2 + '%, 100%, ' + this.lightness + '%)';
    var color2 = tinycolor(color_s2).toRgb();

    var time = audio.currentTime * 1000;
    //console.log(dt);
    var is_bass = (bass > 0.90) && ((time - this.lastBass) > 200);
    if (is_bass) {
        this.lastBass = time;
    }
    for (var i = 0; i < this.numParticles; i++) {
        this.particles.geometry.vertices[i].add(this.dx[i].clone().multiplyScalar(dt));

        this.dx[i].add(this.d2x[i].clone().multiplyScalar(dt));
        if (this.dx[i].length() > this.maxSpeed){
            this.dx[i].normalize().multiplyScalar(this.maxSpeed);
        }
        if (i == 0) {
            //console.log(this.d2x[i]);
        }
        var diff = this.gravityCenter.clone().sub(this.particles.geometry.vertices[i]);
        var dir = diff.clone().normalize();
        var str = diff.length() - 1;
        if (diff.length > 40) {
            this.dx[i] = 0;
        }
        this.d2x[i] = dir.clone().multiplyScalar(this.m[i] * str * this.gravityConstant * (1- Math.random() * 0.1));
        this.d2x[i].add(new THREE.Vector3(Math.random()-0.5, Math.random()-0.99, Math.random()-0.99).multiplyScalar(0.000001));

        if (is_bass) {
            this.dx[i].add(dir.clone().multiplyScalar(-(0.1 + Math.random()*0.2) * (1/(diff.length()))));
            this.dx[i].add(dir.clone().cross(new THREE.Vector3(0, Math.sin(time*0.1), Math.cos(time*0.2)).multiplyScalar(0.1)));
        }
        this.dx[i].multiplyScalar(0.99);
        var lightstr2 = is_bass ? 0.3 : 1;
        var lightstr = 1 / Math.pow((this.lightpos.clone().sub(this.particles.geometry.vertices[i]).length() * lightstr2 * 0.05), 2);
        //console.log(lightstr);
        this.particles.geometry.colors[i] = new THREE.Color(color1.r / 255, color1.g / 255, color1.b / 255).multiplyScalar(lightstr);
        //console.log(color1.r);
        this.particles.geometry.verticesNeedUpdate = true;
        this.particles.geometry.colorsNeedUpdate = true;
    }

    //this.gravityCenter.x = Math.sin(time*0.001) * 15;
    //this.gravityCenter.y = Math.cos(time*0.001) * 15;
    //this.particles.material.size = snare;
    this.lightpos.x = Math.sin(time*0.003) * 15;
    this.lightpos.z = Math.cos(time*0.003) * 15;
    this.uniforms.bass.value = bass;
    this.uniforms.lightPos.value = new THREE.Vector3(color2.r / 255, color2.g / 255, color2.b / 255);
    var timeMod = time % 2000;

    this.hblur.uniforms[ 'h' ].value = Math.max(0, (snare - 0.5)) * 3 / 360;
};
