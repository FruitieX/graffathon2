function Scene13() {
    this.map = THREE.ImageUtils.loadTexture('particle.png');
    this.map.minFilter = THREE.LinearFilter;
    this.rotation = 0;
    this.origin = new THREE.Vector3(0, 0, 0);
    this.material = new THREE.SpriteMaterial({
        color: Math.random() * 0x808080,
        map: this.map
    });
    this.group = new THREE.Group();
    this.hue = 0;

    for (var i = 0; i < 1024; i++) {
        var material = new THREE.SpriteMaterial({
            color: Math.random() * 0x808080,
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

Scene13.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 3000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 70;
    renderer.setClearColor(0xeeeeee, 1);

    curThreeScene.add( this.group );

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    var vignette = new THREE.ShaderPass( THREE.VignetteShader );
    vignette.uniforms['darkness'].value = 1.5;
    vignette.uniforms['offset'].value = 1.0;
    composer.addPass(vignette);

    /*
    var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 32;
    effect.uniforms[ 'tSize' ].value = new THREE.Vector2( 32, 32 );
    composer.addPass( effect );
    */

    this.colorify = new THREE.ShaderPass( THREE.ColorifyShader );
    this.colorify.uniforms['color'].value = new THREE.Color(0.5, 0, 1);
    composer.addPass(this.colorify);

    this.rgbeffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbeffect.uniforms[ 'amount' ].value = 0.0015;
    //this.rgbeffect.renderToScreen = true;
    composer.addPass( this.rgbeffect );

    this.colorcorr = new THREE.ShaderPass( THREE.ColorCorrectionShader );
    composer.addPass( this.colorcorr );

    this.hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    this.hblur.renderToScreen = true;
    composer.addPass( this.hblur );

    composer.render();
};

Scene13.prototype.deinit = function() {
    renderer.setClearColor(0x000000, 1);
};

Scene13.prototype.update = function(dt, t) {
    var speed = bass;
    speed = 0.005 + Math.max(0, (bass - 0.5) * 0.005);

    this.hue = (this.hue + bass * 0.01 * dt) % 360;
    this.lightness = Math.max(50, (bass - 0.5) * 100);
    var color_s = 'hsl(' + this.hue + '%, 100%, ' + this.lightness + '%)';
    var color = tinycolor(color_s).toRgb();
    this.colorify.uniforms['color'].value = new THREE.Color(color.r / 255, color.g / 255, color.b / 255);

    this.rotation -= speed * 0.1 * dt;
    this.origin.x += 10 * 0.1 * dt;
    var radius = 500 + bass * 500;
    camera.position.x = this.origin.x + radius * Math.cos( this.rotation );
    camera.position.z = this.origin.y + radius * Math.sin( this.rotation );
    camera.position.y = this.origin.z + radius * Math.sin( this.rotation );
    camera.lookAt(this.origin);

    var rgbAmount = (speed - 0.005) / 0.0025;
    rgbAmount = Math.pow(rgbAmount, 3);
    rgbAmount *= 0.025;
    this.rgbeffect.uniforms[ 'amount' ].value = rgbAmount;

    this.hblur.uniforms[ 'h' ].value = Math.max(0, rgbAmount * 10) * 2 / 128;

    for (var i = 0; i < Math.round(bass * 20); i++) {
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

    dt = dt;
};
