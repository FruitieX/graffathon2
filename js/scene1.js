function Scene1() {
    var geometry = new THREE.IcosahedronGeometry(2, 0);
    var material = new THREE.MeshPhongMaterial( { color: 0xffffdd, specular: 0x009900, emissive: 0x006063, shininess: 50} );
    this.obj = new THREE.Mesh( geometry, material );
    speed = 0.01;
};

Scene1.prototype.init = function() {

    // Add objects
    curThreeScene = new THREE.Scene();
    camera.position.z = 10;
    curThreeScene.add(this.obj);
 
    // Add ambient lighting
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Add directional lightning
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0, 1, 1 );
    scene.add( directionalLight );
};

Scene1.prototype.deinit = function() {
};

Scene1.prototype.update = function(dt) {
    this.obj.rotation.x += 0.05;
    this.obj.rotation.y += 0.05;
    if (camera.position.z < 3)
        speed *= -1;
    else if (camera.position.z > 15)
        speed *= -1;
    camera.position.z += speed*10;
};
