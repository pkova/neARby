const RenderScene =
`
  <script>
    var camera, controls, animate, heading, scene, headingUpdate, loader, openingGroup;
    var loading = true;
    window.divs = [];
    (function() {
      "use strict";
      window.addEventListener('load', function() {
        var container, renderer, geometry, mesh;
        var frustum = new THREE.Frustum();
        document.body.style.fontFamily = 'Helvetica, sans-serif';
        window.divs = [];

        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        var width = window.innerWidth;
        var height = window.innerHeight;
        var widthHalf = width / 2
        var heightHalf = height / 2;

        // Takes a bounding box and checks for collisions against
        // all other places/events in the scene
        var checkCollision = function(bbox) {
          bbox.update();
          return divs.some(function(cube) {
            var cubeBbox = new THREE.BoundingBoxHelper(cube);
            cubeBbox.update();
            if (bbox.box.intersectsBox(cubeBbox.box)) {
              return true;
            }
          });
        };

        var sizeFont = function(context, text, maxWidth) {
          var width = context.measureText(text).width;
          var fontSize = parseInt(context.font.split(' ')[0], 10);
          while (width > maxWidth) {
            fontSize--;
            var oldFont = context.font.split(' ');
            oldFont[0] = fontSize + 'px';
            context.font = oldFont.join(' ');
            width = context.measureText(text).width;
          }
        };

        window.createPlace = function(lat, long, name, distance, key) {

          var bitmap = document.createElement('canvas');
          var g = bitmap.getContext('2d');
          bitmap.width = 300;
          bitmap.height = 150;
          g.font = 'Bold 30px Helvetica, sans-serif';

          g.fillStyle = '#007F7F';
          g.fillRect(0, 0, bitmap.width, bitmap.height);
          g.fillStyle = 'white';
          sizeFont(g, name, bitmap.width)
          g.textAlign = 'center';
          g.fillText(name, 150, 75);
          g.strokeStyle = 'white';
          g.strokeText(name, 150, 75);
          g.fillText(distance, 150, 125);
          g.strokeStyle = 'white';
          g.strokeText(distance, 150, 125);
          g.strokeRect(0, 0, 300, 150);

          // canvas contents will be used for a texture
          var texture = new THREE.Texture(bitmap);
          texture.needsUpdate = true;

          var geo = new THREE.PlaneGeometry(1, 0.5);
          var mat = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.75, map: texture});
          var cube = new THREE.Mesh(geo, mat);
          cube.position.set(long, 0, -1 * lat);
          cube.position.normalize();
          cube.position.multiplyScalar(3);
          cube.lookAt(camera.position);
          cube.userData.index = key;
          // cube.visible = false;
          scene.add(cube);

          var bbox = new THREE.BoundingBoxHelper(cube, 0xff0000);
          while (checkCollision(bbox)) {
            cube.translateY(0.3);
          }
          cube.matrixAutoUpdate = false;
          window.divs.push(cube);
        };


        var touchHandler = function(event) {
          event.preventDefault();
          event.clientX = event.touches[0].clientX;
          event.clientY = event.touches[0].clientY;
          mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
          mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

          raycaster.setFromCamera( mouse, camera );

          var intersects = raycaster.intersectObjects(divs);

          if ( intersects.length > 0 ) {

            var key = intersects[0].object.userData.index;
            WebViewBridge.send(JSON.stringify({type: 'click', key: key}));

            intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

          }
        }

        window.clearScene = function() {
          window.divs.forEach(function(cube) {
            scene.remove(cube);
          });
        };

        animate = function(now){

          window.requestAnimationFrame( animate );

          if (openingGroup) {
            rotateCubes();
          }

          if (!loading) {
            fadeoutCubes();
          }

          controls.updateAlphaOffsetAngle( (360 - heading) * (Math.PI / 180));
          renderer.render(scene, camera);
        };
        container = document.getElementById( 'container' );
        scene = new THREE.Scene();
        window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
        window.controls = new THREE.DeviceOrientationControls( camera, true );
        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setClearColor( 0x000000, 0 ); // the default
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 0;
        container.appendChild(renderer.domElement);
        renderer.domElement.addEventListener('touchstart', touchHandler, false)

        // var torus = new THREE.TorusGeometry( 100, 30, 50, 100 );
        // var torusMaterial = new THREE.MeshBasicMaterial( { color: "rgb(255, 0, 0)", wireframe: true } );
        // openingTorus = new THREE.Mesh( torus, torusMaterial );
        // openingTorus.position.set(0, 0, -1000);
        // scene.add( openingTorus );

        // var rotateTorus = function() {
        //   if (openingTorus) {
        //     // openingTorus.rotation.y += 0.1;
        //     openingTorus.position.z += 10;
        //   }
        // }

        openingGroup = new THREE.Group();

        for ( var i = 0; i < 100; i ++ ) {
          var color1 = Math.floor(255 * Math.random());
          var color2 = Math.floor(255 * Math.random());
          var color3 = Math.floor(255 * Math.random());

          var cubeMaterial = new THREE.MeshBasicMaterial( { color: "rgb(" + color1 + "," + color2 + "," + color3 + ")" , transparent: true} );
          // var cube = new THREE.TorusGeometry( 5, 2, 10, 20 );
          var cube = new THREE.CubeGeometry( 5, 5, 5 );
          var mesh = new THREE.Mesh( cube, cubeMaterial );
          mesh.position.x = Math.random() * 200 - 100;
          mesh.position.y = Math.random() * 200 - 100;
          mesh.position.z = Math.random() * 200 - 100;

          mesh.rotation.x = Math.random() * 360 * ( Math.PI / 180 );
          mesh.rotation.y = Math.random() * 360 * ( Math.PI / 180 );

          openingGroup.add( mesh );
        }

        openingGroup.position.set(0,0,0);
        scene.add( openingGroup );

        var rotateCubes = function() {
          if (openingGroup) {
            openingGroup.rotation.y += .005;
            openingGroup.rotation.x += .005;
          }
        };

        var fadeoutCubes = function() {
          if (openingGroup.children[0].opacity === 0) {
            scene.remove(openingGroup);
            openingGroup = null;
          }
          for (var i = 0; i < openingGroup.children.length; i++) {
            openingGroup.children[i].material.opacity -= .03
          }
        };

        window.addEventListener('resize', function() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize( window.innerWidth, window.innerHeight );
        }, false);
        }, false);
    }());
  </script>
`;

export default RenderScene;
