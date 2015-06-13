function Scene3() {
    this.map = THREE.ImageUtils.loadTexture('particle.png');
    this.map.minFilter = THREE.LinearFilter;
    this.rotation = 0;
    this.origin = new THREE.Vector3(0, 0, 0);
    this.material = new THREE.SpriteMaterial({
        color: Math.random() * 0x808080,
        map: this.map
    });
    this._sceneTime = 5000; // scene active time in ms
};

Scene3.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 3000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 70;

    var PI2 = Math.PI * 2;
    group = new THREE.Group();
    curThreeScene.add( group );

    for (var i = 0; i < 1000; i++) {
        var material = new THREE.SpriteMaterial({
            color: Math.random() * 0x808080,
            map: this.map
        });
        particle = new THREE.Sprite( material );
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
        group.add( particle );
    }

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    /*
    var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 4;
    composer.addPass( effect );
    */

    var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    effect.uniforms[ 'amount' ].value = 0.0015;
    effect.renderToScreen = true;
    composer.addPass( effect );
    composer.render();
};

Scene3.prototype.deinit = function() {
};

Scene3.prototype.update = function(dt, t) {
    var speed = bass;
    speed = 0.005 + Math.max(0, (bass - 0.5) * 0.005);
    //console.log(speed);

    this.rotation -= speed;
    this.origin.x += 10;
    var radius = 500 + bass * 500;
    camera.position.x = this.origin.x + radius * Math.cos( this.rotation );
    camera.position.z = this.origin.y + radius * Math.sin( this.rotation );
    camera.position.y = this.origin.z + radius * Math.sin( this.rotation );
    camera.lookAt(this.origin);

    for (var i = 0; i < Math.round(bass * 10); i++) {
        var material = new THREE.SpriteMaterial({
            color: Math.random() * 0x808080,
            map: this.map
        });
        particle = new THREE.Sprite( material );
        particle.position.x = this.origin.x + Math.random() * 2000 - 1000;
        particle.position.y = this.origin.y + Math.random() * 2000 - 1000;
        particle.position.z = this.origin.z + Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
        group.add( particle );
        group.children.shift();
    }

    //this.particles.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.01);
    dt = dt;
    //console.log(dt);
};
