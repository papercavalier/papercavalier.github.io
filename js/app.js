var mouse2D = { x: 0, y: 0 },

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,


camera, scene, renderer, projector, orbitRadius, theta, counter,

particles,

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
  /*var light = new THREE.AmbientLight( 0xffffff );
  //var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( -1, -1, -1 ).normalize();
  scene.add( light );*/


  var geo = new THREE.PlaneGeometry(50,50, 20, 20 );
  intersectionPlane = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( { color: 0x888888 } ) );
  //scene.add(intersectionPlane);

  var sphere = new THREE.SphereGeometry(10);
  intersectionObj = new THREE.Mesh( sphere , new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
  //scene.add(intersectionObj);

  sphere = new THREE.SphereGeometry(12);
  mouseObj = new THREE.Mesh( sphere , new THREE.MeshBasicMaterial( { color: 0xFFFF00 } ) );
  //scene.add(mouseObj);

  // Particles
  particles = new Array();

  for (var k=0; k<10; k++){
    var pos = new THREE.Vector3();
    var p = new Hokusai(k, pos);
    scene.add( p );
    particles[k] = p;
  }

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

function updateParticles (){
  for (var k in particles){
    var p = particles[k];
    p.update(mouse2D.x, mouse2D.y);
    p.draw(counter);
  }
   counter++;
}



function animate() {

  requestAnimationFrame( animate );

  render();
}

function render() {
  //updateParticles();

  //camera.position.x += ( mouse2D.x - camera.position.x ) * .05;
  //camera.position.y += ( - mouse2D.y + 200 - camera.position.y ) * .05;

  //orbit
  theta += 0.8;
  camera.position.x = orbitRadius * Math.sin( theta * Math.PI / 360 );
  //camera.position.y = orbitRadius * Math.sin( theta * Math.PI / 360 );
  //camera.position.z = orbitRadius * Math.cos( theta * Math.PI / 360 );
  camera.position.z = 100;
  camera.lookAt( scene.position );


  // find intersections
  /*
  var vector = new THREE.Vector3( mouse2D.x, mouse2D.y, 1 );
  projector.unprojectVector( vector, camera );

  var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

  var intersects = ray.intersectScene( scene );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      INTERSECTED.material.color.setHex( 0xff0000 );
      mouseObj.position.x = INTERSECTED.point.x;
      //mouseObj.position.y = 56;
      //mouseObj.position.z = 0;
    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }
*/



  /*var vector = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
  vector.normalize();
  vector.multiplyScalar(56);

  vector.crossSelf(new THREE.Vector3(1,0,0));
    */





  renderer.render( scene, camera );

}
function onDocumentMouseMove(event) {

  mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function onDocumentTouchStart( event ) {

  if ( event.touches.length > 1 ) {

    event.preventDefault();

    mouse2D.x = event.touches[ 0 ].pageX - windowHalfX;
    mouse2D.y = event.touches[ 0 ].pageY - windowHalfY;

  }

}

function onDocumentTouchMove( event ) {

  if ( event.touches.length == 1 ) {

    event.preventDefault();

    mouse2D.x = event.touches[ 0 ].pageX - windowHalfX;
    mouse2D.y = event.touches[ 0 ].pageY - windowHalfY;

  }

  }
