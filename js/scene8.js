function Scene8() {
    var geometry = new THREE.IcosahedronGeometry(3, 0);
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 1, shading: THREE.FlatShading} );
    this.obj = new THREE.Mesh( geometry, material );
    this.obj.castShadow = true;
    var geometry = new THREE.PlaneGeometry( 1000, 1000 );
    var material = new THREE.MeshPhongMaterial( {color: 0x555555, side: THREE.DoubleSide} );
    this.plane = new THREE.Mesh( geometry, material );
    this.plane.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI/2);
    this.plane.position.y -= 8;
    this.plane.receiveShadow = true;
    this.plane.scale.x = 10;
    this.plane.scale.z = 10;
    this.hue1 = 0;
    this.hue2 = 180;
};

Scene8.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );

    // Init variables
    this.cameraDistance = 10;
    this.cameraAngle = 0;
    this.speed = 0.01;
    
    // Add objects
    curThreeScene = new THREE.Scene();
    camera.position.z = 15;
    camera.position.y = 5;
    curThreeScene.add(this.obj);
    curThreeScene.add(this.plane);

    // Add ambient lighting
    /*
    var ambientLight = new THREE.AmbientLight(0x111122);
    curThreeScene.add(ambientLight);
    */

    // Add directional lightning
    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.33 );
    this.directionalLight.castShadow = true;
    this.directionalLight.shadowMapWidth = 2048;
    this.directionalLight.shadowMapHeight = 2048;
    this.directionalLight.position.set( 50, 30, 2 );
    curThreeScene.add(this.directionalLight);

    // Add point lightning
    this.pointLight = new THREE.PointLight( 0xffffff, 1, 300 );
    this.pointLight.position.set( 0, -5, 0 );
    curThreeScene.add(this.pointLight);

    // Add shadows
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    this.rgbeffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbeffect.uniforms[ 'amount' ].value = 0.0035;
    composer.addPass( this.rgbeffect );

    this.hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    composer.addPass(this.hblur);

    var vignette = new THREE.ShaderPass( THREE.VignetteShader );
    vignette.uniforms['darkness'].value = 1.0;
    vignette.uniforms['offset'].value = 1.0;
    vignette.renderToScreen = true;
    composer.addPass(vignette);
};

Scene8.prototype.deinit = function() {
    renderer.shadowMapEnabled = false;
};

Scene8.prototype.update = function(dt, t) {
    this.hue1 = (this.hue1 + bass * 1) % 360;
    this.hue2 = (this.hue2 + bass * 1) % 360;
    this.lightness = Math.max(50, (bass - 0.5) * 300);

    var cycle = barCycle / 2;
    this.obj.position.y = Math.pow((2 * (t % cycle) - cycle) / 1000, 2) * -10;

    var lightness1 = Math.min(100, Math.max(0, Math.pow((2 * (t % cycle) - cycle) / 1000, 2) * 200));

    var color_s1 = 'hsl(' + this.hue1 + '%, 100%, ' + lightness1 + '%)';
    var color1 = tinycolor(color_s1).toRgb();
    this.pointLight.color = new THREE.Color(color1.r / 255, color1.g / 255, color1.b / 255);

    var color_s2 = 'hsl(' + this.hue2 + '%, 100%, ' + this.lightness + '%)';
    var color2 = tinycolor(color_s2).toRgb();
    //this.directionalLight.color = new THREE.Color(color2.r / 255, color2.g / 255, color2.b / 255);

    this.speed = 0.02 * bass;

    //curThreeScene.children[4].color = new THREE.Color(bass, bass, bass);

    // Increment camera angle [0,2PI]
    this.cameraAngle += 0.00025 * dt % Math.PI * 2;
    /*
    if (this.cameraAngle > Math.PI * 2)
        this.cameraAngle = 0;
    */

    // Camera spin around origin
    camera.position.x = Math.cos(this.cameraAngle) * this.cameraDistance;
    camera.position.z = Math.sin(this.cameraAngle) * this.cameraDistance;
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt( new THREE.Vector3(0, -2, 0) );

    // Camera wobble
    /*
    if (this.cameraAngle >= Math.PI)
        camera.position.y -= 0.01;
    else
        camera.position.y += 0.01;
    */
    camera.position.y = 7 + Math.sin(t / 1000) * 1;

    // Rotate and scale object
    this.obj.rotation.x += this.speed * 0.1 * dt;
    this.obj.rotation.y += this.speed * 2 * 0.1 * dt;

    this.obj.scale.x = 0.25 + Math.max(0, (bass * 1.25));
    this.obj.scale.y = this.obj.scale.x;
    this.obj.scale.z = this.obj.scale.x;

    cycle *= 2;
    var rgbAmount = Math.pow((2 * (t % cycle) - cycle) / 1000, 6);
    rgbAmount = Math.pow(rgbAmount, 3);
    rgbAmount *= 0.00025;
    this.rgbeffect.uniforms[ 'amount' ].value = 0.001 + rgbAmount + snare * 0.002;
    this.hblur.uniforms[ 'h' ].value = Math.max(0, rgbAmount * 10) * 2 / 256;
};
