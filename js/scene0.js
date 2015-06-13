function Scene0() {
    var textMaterial = new THREE.MeshPhongMaterial({
        color: 0x00dddd,
        specular: 0xffffff,
        shininess: 100
    });
    var textGeom = new THREE.TextGeometry( 'rect.get();', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    this.textMesh = new THREE.Mesh( textGeom, textMaterial );
    this._sceneTime = 50000; // scene active time in ms
    this.tempSpeed = 0;
    this.flag = 0.01;

    this.cameraDistance = 50;
    this.cameraAngle = 0;
};

Scene0.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 50;
    this.textMesh.position.x = -25;
    curThreeScene.add(this.textMesh);

    var pointLight = new THREE.PointLight( 0xffffff, 0.5)
    pointLight.position.set( 0, -5 , -5 );
    curThreeScene.add(pointLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    directionalLight.position.set( 2, 2, 2 );
    curThreeScene.add(directionalLight);
};

Scene0.prototype.deinit = function() {
};

Scene0.prototype.update = function(dt, t) {
    
    // Increment camera angle [0,PI]
    this.cameraAngle = Math.PI/2 + Math.cos(t / 1000) * Math.PI/3;

    // Camera spin around origin + bass
    camera.position.x = Math.cos(this.cameraAngle) * this.cameraDistance * (0.5 + 0.5* bass);
    camera.position.z = Math.sin(this.cameraAngle) * this.cameraDistance * (0.5 + 0.5* bass);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt( new THREE.Vector3(0, 0, 0) );
    
    // Bouncy text
    if (bass > 0.8 && this.tempSpeed == 0 && this.textMesh.position.y <= 0) { 
        this.tempSpeed = 10;
        this.flag = 0;
    }
    if (this.tempSpeed > 0) {
        this.textMesh.position.y += 0.01 * this.tempSpeed;
        this.tempSpeed -= 1;
    }
    if (this.textMesh.position.y > 0 && this.tempSpeed == 0)
        this.textMesh.position.y -= 0.5;
};
