function Scene7() {
    this.map = THREE.ImageUtils.loadTexture('particle.png');
    this.map.minFilter = THREE.LinearFilter;
    this.rotation = 0;
    this.lightRotation = 0;
    this.origin = new THREE.Vector3(0, 0, 0);
    this.material = new THREE.SpriteMaterial({
        color: Math.random() * 0x808080,
        map: this.map
    });
    this.hue = 0;

    this.object = new THREE.Object3D();

    var geometry = new THREE.IcosahedronGeometry(3, 0);
    this.material = new THREE.MeshPhongMaterial( { color: 0x000000, shading: THREE.FlatShading } );

    for ( var i = 0; i < 400; i ++ ) {

        var mesh = new THREE.Mesh( geometry, this.material );
        mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 400 );
        mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 20;
        this.object.add( mesh );

    }
};

Scene7.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 3000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 100;
    renderer.setClearColor(0xeeeeee, 1);

    curThreeScene.add( this.object );
    curThreeScene.add( new THREE.AmbientLight( 0x050505 ) );

    this.light = new THREE.DirectionalLight( 0xffffff );
    this.light.position.set( 1, 1, 1 );
    curThreeScene.add( this.light );

    var ambientLight = new THREE.AmbientLight(0x444444);
    curThreeScene.add(ambientLight);

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    this.rgbeffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbeffect.uniforms[ 'amount' ].value = 0.0015;
    composer.addPass( this.rgbeffect );

    this.colorcorr = new THREE.ShaderPass( THREE.ColorCorrectionShader );
    //this.colorcorr.uniforms[ 'amount' ].value = 0.0015;
    composer.addPass( this.colorcorr );

    this.hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    composer.addPass(this.hblur);

    var kaleido = new THREE.ShaderPass( THREE.KaleidoShader );
    kaleido.uniforms['sides'].value = 6;
    composer.addPass( kaleido );

    var vignette = new THREE.ShaderPass( THREE.VignetteShader );
    vignette.uniforms['darkness'].value = 1.5;
    vignette.uniforms['offset'].value = 1.0;
    vignette.renderToScreen = true;
    composer.addPass(vignette);
};

Scene7.prototype.deinit = function() {
    renderer.setClearColor(0x000000, 1);
};

Scene7.prototype.update = function(dt, t) {
    this.hue = (this.hue + bass * 1) % 360;
    this.lightness = Math.max(50, (bass - 0.5) * 100);
    var color_s = 'hsl(' + this.hue + '%, 100%, ' + this.lightness + '%)';
    var color = tinycolor(color_s).toRgb();
    this.material.color = new THREE.Color(color.r / 255, color.g / 255, color.b / 255);

    this.rotation -= 0.00025 * dt + Math.max(0, (snare - 0.5)) * 0.025;
    this.lightRotation += 0.15;
    //this.origin.x += 10;
    var radius = 500 - Math.max(50, (bass - 0.5) * 300);

    camera.position.x = this.origin.x - radius * Math.cos( this.rotation );
    camera.position.y = this.origin.y + radius * Math.sin(t / 1000) / 3;
    camera.position.z = this.origin.z + radius * Math.sin( this.rotation );
    camera.lookAt(this.origin);

    this.light.x = this.origin.x + radius * Math.cos( this.lightRotation );
    this.light.y = this.origin.y + radius * Math.sin( this.lightRotation );

    this.hblur.uniforms[ 'h' ].value = Math.max(0, (snare - 0.5)) * 3 / 256;
};
