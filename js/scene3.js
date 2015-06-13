function Scene3() {
    this.map = THREE.ImageUtils.loadTexture('particle.png');
    this._sceneTime = 5000; // scene active time in ms
};

Scene3.prototype.init = function() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
    curThreeScene = new THREE.Scene();
    camera.position.z = 70;

    var PI2 = Math.PI * 2;
    group = new THREE.Group();
    curThreeScene.add( group );

    for (var i = 0; i < 1000; i++) {
        var material = new THREE.SpriteMaterial({
            color: Math.random() * 0x808008 + Math.random() * 0x808080,
            map: this.map
        });
        particle = new THREE.Sprite( material );
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
        group.add( particle );
    }
};

Scene3.prototype.deinit = function() {
};

Scene3.prototype.update = function(dt, t) {
    var origin = new THREE.Vector3(0, 0, 0);
    var radius = 1000;
    var speed = 1;
    camera.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.01);
    camera.position.x = radius * Math.cos( speed * t / 1000 );
    camera.position.z = radius * Math.sin( speed * t / 1000 );
    camera.lookAt(origin);
    //this.particles.rotateOnAxis(new THREE.Vector3(1, 1, 0), 0.01);
    dt = dt;
    //console.log(dt);
};
