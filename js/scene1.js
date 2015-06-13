function Scene1() {
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
    this._sceneTime = 10000; // scene active time in ms
};

Scene1.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );

    // Init variables
    this.cameraDistance = 10;
    this.cameraAngle = 0;
    this.speed = 0.01;
    
    // Add objects
    curThreeScene = new THREE.Scene();
    camera.position.z = 10;
    camera.position.y = 4;
    curThreeScene.add(this.obj);
    curThreeScene.add(this.plane);

    // Add ambient lighting
    /*
    var ambientLight = new THREE.AmbientLight(0x111122);
    curThreeScene.add(ambientLight);
    */

    // Add directional lightning
    var directionalLight = new THREE.DirectionalLight( 0x00dddd, 0.25 );
    directionalLight.castShadow = true;
    directionalLight.shadowMapWidth = 2048;
    directionalLight.shadowMapHeight = 2048;
    directionalLight.position.set( 50, 30, 2 );
    curThreeScene.add(directionalLight);

    // Add point lightning
    var pointLight = new THREE.PointLight( 0xffffff, 1, 200 );
    pointLight.position.set( -50, 20, 0 );
    curThreeScene.add(pointLight);

    // Add shadows
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    this.rgbeffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbeffect.uniforms[ 'amount' ].value = 0.0015;
    composer.addPass( this.rgbeffect );

    var vignette = new THREE.ShaderPass( THREE.VignetteShader );
    vignette.uniforms['darkness'].value = 1.0;
    vignette.uniforms['offset'].value = 1.0;
    vignette.renderToScreen = true;
    composer.addPass(vignette);
};

Scene1.prototype.deinit = function() {
    renderer.shadowMapEnabled = false;
};

Scene1.prototype.update = function(dt, t) {

    this.speed = 0.02 * bass;

    //curThreeScene.children[4].color = new THREE.Color(bass, bass, bass);

    // Increment camera angle [0,2PI]
    this.cameraAngle += 0.01;
    if (this.cameraAngle > Math.PI * 2)
        this.cameraAngle = 0;

    // Camera spin around origin
    camera.position.x = Math.cos(this.cameraAngle) * this.cameraDistance;
    camera.position.z = Math.sin(this.cameraAngle) * this.cameraDistance;
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt( new THREE.Vector3(0, -2, 0) );

    // Camera wobble
    if (this.cameraAngle >= Math.PI)
        camera.position.y -= 0.01;
    else
        camera.position.y += 0.01;

    // Rotate and scale object
    this.obj.rotation.x += this.speed;
    this.obj.rotation.y += this.speed * 8;

    this.obj.scale.x = 0.5 + Math.max(0, (bass));
    this.obj.scale.y = this.obj.scale.x;
    this.obj.scale.z = this.obj.scale.x;

    var cycle = 1000 / (bpm / 60) * 2;
    this.obj.position.y = Math.pow((2 * (t % cycle) - cycle) / 1000, 2) * -10;
};
