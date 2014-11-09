(function() {

  function createScene() {
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

    return {
      scene: scene,
      camera: camera,
      renderer: renderer,
      objects: objects
    };
  }

  function addCube() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    globals.objects.push(cube);

    globals.camera.position.x = 5;
    globals.camera.position.y = 5;
    globals.camera.position.z = 5;

    return cube;
  }

  function render() {
    requestAnimationFrame(render);
    globals.renderer.render(globals.scene, globals.camera);
  }

  function init() {
    addCube();
    render();
  }

  var globals = createScene();
  init();

})();