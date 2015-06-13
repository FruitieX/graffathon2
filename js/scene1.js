function Scene1() {
    var geometry = new THREE.IcosahedronGeometry(2, 0);
    var material = new THREE.MeshPhongMaterial( { color: 0xffffdd, specular: 0xffffff, shininess: 1} );
    this.obj = new THREE.Mesh( geometry, material );
    var geometry = new THREE.PlaneGeometry( 1000, 1000 );
    var material = new THREE.MeshPhongMaterial( {color: 0x333333, side: THREE.DoubleSide} );
    this.plane = new THREE.Mesh( geometry, material ); 
    this.plane.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(), Math.PI/2);
    this.plane.position.y -= 10;
    this._sceneTime = 10000; // scene active time in ms
};

Scene1.prototype.init = function() {

    // Init variables
    this.cameraDistance = 10;
    this.cameraAngle = 0;
    this.speed = 0.01;
    
    // Add objects
    curThreeScene = new THREE.Scene();
    camera.position.z = 10;
    curThreeScene.add(this.obj);
    curThreeScene.add(this.plane);

    // Add ambient lighting
    var ambientLight = new THREE.AmbientLight(0x000022);
    curThreeScene.add(ambientLight);

    // Add directional lightning
    var directionalLight = new THREE.DirectionalLight( 0x00dddd, 0.5 );
    directionalLight.position.set( 2, 2, 2 );
    curThreeScene.add(directionalLight);

    var pointLight = new THREE.PointLight( 0xffffff, 1, 20 );
    pointLight.position.set( 0, -5, 0 );
    curThreeScene.add(pointLight);
};

Scene1.prototype.deinit = function() {
};

Scene1.prototype.update = function(dt) {

    // Increment camera angle
    this.cameraAngle += this.speed;
    if (this.cameraAngle > Math.PI * 2)
        this.cameraAngle = 0;
    camera.position.x = Math.cos(this.cameraAngle) * this.cameraDistance;
    camera.position.z = Math.sin(this.cameraAngle) * this.cameraDistance;
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt( new THREE.Vector3(0, 0, 0) );

    if (this.cameraAngle >= Math.PI)
        camera.position.y -= this.speed;
    else
        camera.position.y += this.speed;

    this.obj.rotation.x += 0.01;
    this.obj.rotation.y += 0.08;
};
