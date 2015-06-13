function Scene0() {
    var textMaterial = new THREE.MeshPhongMaterial({
        color: 0x00dddd,
        specular: 0xffffff,
        shininess: 100
    });
    var textGeom = new THREE.TextGeometry( 'rect.get', {
        font: 'helvetiker',
        size: 10,
        height: 2
    });
    this.textMesh = new THREE.Mesh( textGeom, textMaterial );
    this._sceneTime = barCycle * 8; // scene active time in ms
    this.tempSpeed = 0;
    this.flag = 0;
};

Scene0.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 50;
    this.textMesh.position.x = -50;
    curThreeScene.add(this.textMesh);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    directionalLight.position.set( 2, 2, 2 );
    curThreeScene.add(directionalLight);
};

Scene0.prototype.deinit = function() {
};

Scene0.prototype.update = function(dt) {
    this.textMesh.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/600);
    if (bass > 0.9 && this.tempSpeed == 0 && this.textMesh.position.y <= 0) { 
        this.tempSpeed = 20;
        this.flag = 0;
    }
    console.log(this.tempSpeed);
    if (this.tempSpeed > 0) {
        this.textMesh.position.y += 0.01 * this.tempSpeed;
        this.tempSpeed--;
    }
    console.log(this.textMesh.position.y);
    if (this.textMesh.position.y > 0 && this.tempSpeed == 0)
        this.textMesh.position.y -= 0.5;
};
