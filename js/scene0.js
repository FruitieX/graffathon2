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
    var textSquared = new THREE.TextGeometry( 'squared', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    var textTriangled = new THREE.TextGeometry( 'triangled', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    var textPentagoned = new THREE.TextGeometry( 'pentagoned', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    var textHexagoned = new THREE.TextGeometry( 'hexagoned', {
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

    var textTransformed = new THREE.TextGeometry( 'transformed', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });

    var textParticled = new THREE.TextGeometry( 'particled', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });

    this.textMeshes = [
        new THREE.Mesh( textGet, textMaterial ),
        new THREE.Mesh( textRekt, textMaterial2 ),
        new THREE.Mesh( textCubed, textMaterial ),
        new THREE.Mesh( textDOTted, textMaterial ),
        new THREE.Mesh( textLined, textMaterial ),
        new THREE.Mesh( textShaded, textMaterial ),
        new THREE.Mesh( textSquared, textMaterial ),
        new THREE.Mesh( textTriangled, textMaterial ),
        new THREE.Mesh( textPentagoned, textMaterial ),
        new THREE.Mesh( textHexagoned, textMaterial ),
        new THREE.Mesh( textTransformed, textMaterial ),
        new THREE.Mesh( textParticled, textMaterial ),
    ]
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

    this.textMeshes[0].position.x = -25;

    _.each(this.textMeshes, function(textMesh) {
        curThreeScene.add(textMesh);
        textMesh.visible = false;
    });

    this.textArray = [];
    this.textArray.push(this.textMeshes[2]);
    this.textArray.push(this.textMeshes[3]);
    this.textArray.push(this.textMeshes[4]);
    this.textArray.push(this.textMeshes[5]);
    this.textArray.push(this.textMeshes[6]);
    this.textArray.push(this.textMeshes[7]);
    this.textArray.push(this.textMeshes[8]);
    this.textArray.push(this.textMeshes[9]);
    this.textArray.push(this.textMeshes[10]);
    this.textArray.push(this.textMeshes[11]);
    this.textArray.push(this.textMeshes[5]);
    this.textArray.push(this.textMeshes[6]);
    this.textArray.push(this.textMeshes[7]);
    this.textArray.push(this.textMeshes[9]);
    this.textArray.push(this.textMeshes[1]);

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
        this.textMeshes[0].visible = true;
    else
        this.textMeshes[0].visible = false;
    
    if (t % (barCycle / 2) < 100) {
        if (this.beat == false) {
            this.beat = true;
            for (var i = 1; i < this.textMeshes.length; i++) {
                this.textMeshes[i].visible = false;
            }
            this.textArray[this.index].visible = true;
            this.index = Math.min(this.textArray.length - 1, (this.index + 1));
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
    if (bass > 0.9 && this.tempSpeed == 0 && this.textMeshes[1].position.y <= 0)
        this.tempSpeed = 10;

    if (this.tempSpeed > 0) {
        this.textMeshes[1].position.y += 0.01 * this.tempSpeed;
        this.tempSpeed -= 1;
    }
    if (this.textMeshes[1].position.y > 0 && this.tempSpeed == 0)
        this.textMeshes[1].position.y -= 0.5;
};
