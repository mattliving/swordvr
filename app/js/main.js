(function() {

  function SVRA() {
    this.init();
    this.startingTime = (new Date()).getTime();
  }

  SVRA.prototype._createScene = function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(120 , window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var objects = [];
    objects.push = function() {
      var args = [].slice.apply(arguments);
      if (args.length > 1) {
        args.forEach(function(item, index) {
          scene.add(item);
        });
      }
      else scene.add(args[0]);
      return [].push.apply(this, arguments);
    }

    this.scene    = scene;
    this.camera   = camera;
    this.renderer = renderer;
    this.objects  = objects;
  }

  SVRA.prototype._loadTextures = function() {

  }

  SVRA._getObject = function(key) {
    this.objects.forEach(function(object) {
      if (object.key === key) return object;
    });
    return null;
  }

  SVRA.prototype.addCube = function(opts) {

    var material;
    if (opts.texture) {
      material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture(opts.texture) });
    }
    else {
      material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: opts.color, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
    }
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var cube = new THREE.Mesh(geometry, material);
    // cube.update = opts.update && opts.update.bind(this);
    this.objects.push(cube);

    if (opts.boundingBox) {
      var bbox = new THREE.BoundingBoxHelper(cube, opts.color);
      bbox.update();
      this.objects.push(bbox);
    }

    return cube;
  }

  SVRA.prototype.addPlane = function(opts) {
    var geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    var material = new THREE.MeshBasicMaterial({
      color: opts.color,
      side: THREE.DoubleSide,
      wireframe: true,
      wireframeLinecap: "square"
    });
    var plane = new THREE.Mesh(geometry, material);
    // plane.update = opts.update.bind(this);
    this.objects.push(plane);

    if (opts.boundingBox) {
      var bbox = new THREE.BoundingBoxHelper(plane, opts.color);
      bbox.update();
      this.objects.push(bbox);
    }

    return plane;
  }

  SVRA.prototype._applyTransformations = function() {
    this.objects.forEach(function(object) {
      if (typeof object.update === "function") {
        object.update();
      }
    });
  }

  SVRA.prototype._animate = function() {
    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;
    var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
    plane.rotation.z += angleChange;
    lastTime = time;
  }

  SVRA.prototype._render = function() {
    this._applyTransformations();
    // animate();
    // this.cube.rotation.x += 0.05;
    // this.cube.rotation.y += 0.05;
    // this.plane.rotation.x += 0.01;
    // this.plane.rotation.y += 0.01;
    requestAnimationFrame(this._render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  SVRA.prototype.init = function() {
    this._createScene();
    var origin = new THREE.Vector3(0, 0, 0);
    this.plane = this.addPlane({
      color: 0xbababa,
      boundingBox: true
    });
    this.cube = this.addCube({
      texture: "textures/tatami1.jpg",
      color: 0x00ff00,
      // boundingBox: true,
      position: { x: -5, y: -5 }
    });
    this.cube.position.z += 5;

    this.camera.position.x = 1;
    this.camera.position.y = 1;
    this.camera.position.z = 7;
    this.camera.lookAt(origin);

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    this.scene.add(light);

    this._render();
  }

  // window.addEventListener( 'resize', onWindowResize, false );

//   function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     render();
//   }

  var app = new SVRA();

})();