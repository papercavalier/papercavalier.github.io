var mouse2D = { x: 0, y: 0 },

SCREEN_WIDTH = window.innerWidth,
SCREEN_HEIGHT = window.innerHeight,
SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2,

camera, scene, renderer, projector, orbitRadius, theta, counter,

particles, sheets,

mouseObj, intersectionPlane, intersectionObj,INTERSECTED;

init();
animate();

function init() {


  var container;

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  //camera.position.z = 100;

  scene = new THREE.Scene();

  scene.add( camera );
  projector = new THREE.Projector();

  renderer = new THREE.CanvasRenderer();
  //renderer = new THREE.WebGLRenderer({antialias: true });
  renderer.sortObjects = false;
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );
  orbitRadius = 100;
  theta = 0;
  counter = 0;

 /* var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
  directionalLight.position.x = Math.random() - 0.5;
  directionalLight.position.y = Math.random() - 0.5;
  directionalLight.position.z = Math.random() - 0.5;
  directionalLight.position.normalize();
  scene.add( directionalLight );

  var geo = new THREE.PlaneGeometry(50,50, 20, 20 );
  intersectionPlane = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0x888888 } ) );
 // scene.add(intersectionPlane);

  var sphere = new THREE.SphereGeometry(10);
  intersectionObj = new THREE.Mesh( sphere , new THREE.MeshBasicMaterial( { color: 0x123445 } ) );
  //scene.add(intersectionObj);

  sphere = new THREE.SphereGeometry(12);
  mouseObj = new THREE.Mesh( sphere , new THREE.MeshBasicMaterial( { color: 0xff0000,  wireframe: true, doubleSided: true , blending: THREE.AdditiveBlending }) );
  //scene.add(mouseObj);*/


  var Particle = function () {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    var _seed = Math.random();
    this._goal = new THREE.Vector3 (100,0,0)
    var _acceleration = new THREE.Vector3();
    var _maxSpeed = 4;

    this.setGoal = function ( target ) {

       _goal = target;

    }

    this.flock = function ( boids ) {

      //if ( _goal ) {

      _acceleration.addSelf( this.reach( this._goal, 0.005*_seed ) );

      //}

      //_acceleration.addSelf( this.alignment( boids ) );
      //_acceleration.addSelf( this.cohesion( boids ) );
      //_acceleration.addSelf( this.separation( boids ) );

    }

  /*  this.repulse = function ( target ) {

      var distance = this.position.distanceTo( target );

     if ( distance < 150 ) {
        console.log("distance < 150")
        var steer = new THREE.Vector3();

        steer.sub( this.position, target );
        steer.multiplyScalar( 0.5 / distance );

        _acceleration.addSelf( steer );
      }
    }*/

    this.reach = function ( target, amount ) {

      var steer = new THREE.Vector3();

      steer.sub( target, this.position );
      steer.multiplyScalar( amount );

      return steer;

    }

    this.move = function () {

      this.velocity.addSelf( _acceleration );
      var l = this.velocity.length();

      if ( l > _maxSpeed ) {

        this.velocity.divideScalar( l / _maxSpeed );
      }
      this.position.addSelf( this.velocity );
      _acceleration.set( 0, 0, 0 );

    }
    this.rotate = function () {
      this.rotation.x += (Math.sin(counter/10)*_seed+_seed/2)/2;
      this.rotation.y += (Math.sin(counter/10)*_seed+_seed/2)/2;
      this.rotation.z += (Math.sin(counter/10)*_seed+_seed/2)/2;

    }
    this.run = function ( particles ) {
      this.flock();
      this.move();
      this.rotate();
    }
    
  }

  // Create sheets of paper
  particles = new Array();
  sheets = new Array();

  for (var k=0; k<10; k++){

    var p = particles [k] = new Particle();
   //p.position.x = Math.random() * 200 - 200;
    //p.position.y = Math.random() * 200 - 200;
    //p.position.z = Math.random() * 200 - 200;
    //p.velocity.x = Math.random()  - .5;
    //p.velocity.y = Math.random()  - .5;
    ///p.velocity.z = Math.random()  - .5;


    //var c = 0xEEEEEE*Math.random();
    var pos = new THREE.Vector3(new THREE.Vector3(Math.random()*12,Math.random()*12, Math.random()*12));
    var sheetSize = 20;
    var sheet = sheets[k] = new THREE.Mesh(new Hokusai(k, pos, sheetSize),new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false } ) );
    scene.add( sheet);

    sheet.position = p.position;
  }

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

function updateParticles (){


  for (var k in particles){
    if (counter%100==0) {
      particles[k]._goal = new THREE.Vector3 (Math.random()*100, Math.random()*100, Math.random()*10)
      console.log("reposition")
    }
    sheets[k].position = particles[k].position;
    sheets[k].rotation = particles[k].rotation;
    particles[k].run();

    //p.position.y = Math.sin(counter/20*k)*20;
  }
   counter++;
}



function animate() {

  requestAnimationFrame( animate );

  render();
}

function render() {
  updateParticles();

  //camera.position.x += ( mouse2D.x - camera.position.x ) * .05;
  //camera.position.y += ( - mouse2D.y + 200 - camera.position.y ) * .05;

  //orbit
  theta += 0.8;
  //camera.position.x = orbitRadius * Math.sin( theta * Math.PI / 360 );
  //camera.position.y = orbitRadius * Math.sin( theta * Math.PI / 360 );
  //camera.position.z = orbitRadius * Math.cos( theta * Math.PI / 360 );
  camera.position.z = 100;
  camera.lookAt( scene.position );


  renderer.render( scene, camera );

}
function onDocumentMouseMove(event) {

  mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

/*
  var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

   for (var k in particles){
    vector.z = particles[k].position.z;
    particles[k].repulse( vector);

  }*/

}


function onDocumentTouchStart( event ) {

  if ( event.touches.length > 1 ) {

    event.preventDefault();

    mouse2D.x = event.touches[ 0 ].pageX - SCREEN_WIDTH_HALF;
    mouse2D.y = event.touches[ 0 ].pageY - SCREEN_HEIGHT_HALF;

  }

}

function onDocumentTouchMove( event ) {

  if ( event.touches.length == 1 ) {

    event.preventDefault();

    mouse2D.x = event.touches[ 0 ].pageX - SCREEN_WIDTH_HALF;
    mouse2D.y = event.touches[ 0 ].pageY - SCREEN_HEIGHT_HALF;

  }

  }
