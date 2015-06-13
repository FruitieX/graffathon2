function Scene4() {
    this.map = THREE.ImageUtils.loadTexture('particle.png');
    this.map.minFilter = THREE.LinearFilter;
    this.rotation = 0;
    this.origin = new THREE.Vector3(0, 0, 0);
    this.material = new THREE.SpriteMaterial({
        color: Math.random() * 0x808080,
        map: this.map
    });
    this._sceneTime = 5000; // scene active time in ms

    this.group = new THREE.Group();

    for (var i = 0; i < 1000; i++) {
        var material = new THREE.SpriteMaterial({
            color: 0x000000,
            map: this.map
        });
        particle = new THREE.Sprite( material );
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        //particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
        particle.scale.x = particle.scale.y = particle.scale.z = 100;
        this.group.add( particle );
    }

};

Scene4.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 3000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 70;
    renderer.setClearColor(0xeeeeee, 1);

    curThreeScene.add( this.group );

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    /*
    var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 32;
    effect.uniforms[ 'tSize' ].value = new THREE.Vector2( 32, 32 );
    composer.addPass( effect );
    */

    this.rgbeffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbeffect.uniforms[ 'amount' ].value = 0.0015;
    this.rgbeffect.renderToScreen = true;
    composer.addPass( this.rgbeffect );
    composer.render();
};

Scene4.prototype.deinit = function() {
    renderer.setClearColor(0x000000, 1);
};

Scene4.prototype.update = function(dt, t) {
    var speed = bass;
    speed = 0.005 + Math.max(0, (bass - 0.5) * 0.005);

    this.rotation -= speed;
    //this.origin.x += 10;
    var radius = 500 + bass * 500;
    /*
    camera.position.x = this.origin.x + radius * Math.cos( this.rotation );
    camera.position.z = this.origin.y + radius * Math.sin( this.rotation );
    camera.position.y = this.origin.z + radius * Math.sin( this.rotation );
    */
    camera.lookAt(this.origin);

    var rgbAmount = (speed - 0.005) / 0.0025;
    rgbAmount = Math.pow(rgbAmount, 3);
    rgbAmount *= 0.01;
    this.rgbeffect.uniforms[ 'amount' ].value = rgbAmount;

    /*
    for (var i = 0; i < Math.round(bass * 10); i++) {
        var material = new THREE.SpriteMaterial({
            color: Math.random() * 0xffffff,
            map: this.map
        });
        particle = new THREE.Sprite( material );
        particle.position.x = this.origin.x + Math.random() * 2000 - 1000;
        particle.position.y = this.origin.y + Math.random() * 2000 - 1000;
        particle.position.z = this.origin.z + Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y = particle.scale.z = bass * 200;
        this.group.add( particle );
        this.group.children.shift();
    }
    */

    dt = dt;
};
