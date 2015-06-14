function Scene0() {
    var textMaterial2 = new THREE.MeshPhongMaterial({
        color: 0xff0011,
        specular: 0xffffff,
        shininess: 100
    });
    var textMaterial = new THREE.MeshPhongMaterial({
        color: 0x00dddd,
        specular: 0xffffff,
        shininess: 100
    });
    var textGet = new THREE.TextGeometry( 'get', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    var textRekt = new THREE.TextGeometry( 'rekt', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    var textCubed = new THREE.TextGeometry( 'cubed', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    var textDOTted = new THREE.TextGeometry( 'DOTted', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });

    var textLined = new THREE.TextGeometry( 'lined', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });

    var textShaded = new THREE.TextGeometry( 'shaded', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    
    this.textMesh1 = new THREE.Mesh( textGet, textMaterial );
    this.textMesh2 = new THREE.Mesh( textRekt, textMaterial2 );
    this.textMesh3 = new THREE.Mesh( textCubed, textMaterial );
    this.textMesh4 = new THREE.Mesh( textDOTted, textMaterial );
    this.textMesh5 = new THREE.Mesh( textLined, textMaterial );
    this.textMesh6 = new THREE.Mesh( textShaded, textMaterial );
    this.tempSpeed = 0;
    this.index = 0;

    this.cameraDistance = 75;
    this.cameraAngle = 0;
    this.beat = false;
};

Scene0.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 50;
    this.textMesh1.position.x = -25;
    curThreeScene.add(this.textMesh1);
    curThreeScene.add(this.textMesh2);
    curThreeScene.add(this.textMesh3);
    curThreeScene.add(this.textMesh4);
    curThreeScene.add(this.textMesh5);
    curThreeScene.add(this.textMesh6);

    this.textMesh2.visible = false;
    this.textMesh3.visible = false;
    this.textMesh4.visible = false;
    this.textMesh5.visible = false;
    this.textMesh6.visible = false;

    this.textArray = [];
    this.textArray.push(this.textMesh5);
    this.textArray.push(this.textMesh3);
    this.textArray.push(this.textMesh6);
    this.textArray.push(this.textMesh4);
    this.textArray.push(this.textMesh2);

    renderer.setClearColor(0x004444, 1);

    var pointLight = new THREE.PointLight( 0xffffff, 0.9)
    pointLight.position.set( 0, -5 , -5 );
    curThreeScene.add(pointLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9);
    directionalLight.position.set( 2, 2, 2 );
    curThreeScene.add(directionalLight);

    // postprocessing
    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( curThreeScene, camera ) );

    this.rgbeffect = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbeffect.uniforms[ 'amount' ].value = 0.003;
    composer.addPass( this.rgbeffect );

    this.colorcorr = new THREE.ShaderPass( THREE.ColorCorrectionShader );
    //this.colorcorr.uniforms[ 'amount' ].value = 0.0015;
    composer.addPass( this.colorcorr );

    var vignette = new THREE.ShaderPass( THREE.VignetteShader );
    vignette.uniforms['darkness'].value = 1.5;
    vignette.uniforms['offset'].value = 0.5;
    vignette.renderToScreen = true;
    composer.addPass(vignette);
};

Scene0.prototype.deinit = function() {
    renderer.setClearColor(0x000000, 1);
};

Scene0.prototype.update = function(dt, t) {
    
    // Increment camera angle [0,PI]
    this.cameraAngle = Math.PI/2 + Math.cos(t / 1000) * Math.PI/6;

    // Every drum beat
    if (t % (barCycle / 2) < 350)
        this.textMesh1.visible = true;
    else
        this.textMesh1.visible = false;
    
    if (t % (barCycle / 2) < 100) {
        if (this.beat == false) {
            this.beat = true;
            this.textMesh2.visible = false;
            this.textMesh3.visible = false;
            this.textMesh4.visible = false;
            this.textMesh5.visible = false;
            this.textMesh6.visible = false;
            this.textArray[this.index].visible = true;
            this.index = (this.index + 1) % this.textArray.length;
        }
    }
    else {
        this.beat = false;
    }

    // Camera spin around origin + bass
    camera.position.x = Math.cos(this.cameraAngle) * this.cameraDistance * (0.5 + 0.5* bass);
    camera.position.z = Math.sin(this.cameraAngle) * this.cameraDistance * (0.5 + 0.5* bass);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt( new THREE.Vector3(0, 0, 0) );

    // Bouncy text
    if (bass > 0.9 && this.tempSpeed == 0 && this.textMesh2.position.y <= 0)
        this.tempSpeed = 10;

    if (this.tempSpeed > 0) {
        this.textMesh2.position.y += 0.01 * this.tempSpeed;
        this.tempSpeed -= 1;
    }
    if (this.textMesh2.position.y > 0 && this.tempSpeed == 0)
        this.textMesh2.position.y -= 0.5;
};
