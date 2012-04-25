$(function() {

  var mouse2D = { x: 0, y: 0 },

  PARTICLES_COUNT = 10, 
  SHEET_WIDTH = 10,
  //START_POSITION = new THREE.Vector3 (-40,-25,0),

  SCREEN_WIDTH = $(".container").width(),
  SCREEN_HEIGHT = 682,
  SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
  SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2,

  camera, scene, renderer, projector, orbitRadius, theta, counter, particles, sheets;

  window.DRAG = .92;
  window.GRAVITY = .03;

  init();
  animate();

  
  function init() {

    //SCENE
    scene = new THREE.Scene();
   
    //CAMERA
    camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    camera.position.y = 10;
    camera.position.x = 0;
    camera.position.z = 150;
    scene.add( camera );

    //CUBE
    var cube = new THREE.Mesh(
      new THREE.CubeGeometry( 80, 50, 50),
      new THREE.MeshLambertMaterial( { color: 0xFF0000, wireframe: true } )
    );
    cube.doubleSided = true;
    scene.add( cube );

    //RENDERER
    projector = new THREE.Projector();
    renderer = new THREE.CanvasRenderer();
    renderer.sortObjects = false;
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    //DOM
    var container = document.createElement('div');
    $("#hokusai .container").append(container);
    container.appendChild( renderer.domElement );


    orbitRadius = 100;
    theta = 0;
    counter = 0;

    var Particle = function () {
      this.position = new THREE.Vector3();
      this.velocity = new THREE.Vector3();
      this.rotation = new THREE.Vector3();
      this.seed = Math.random();
      this.goal = new THREE.Vector3 (100,0,0);
      this.running = false;
      this.ID =0;

      var  _width = 500, _height = 500, _depth = 200;
      var _acceleration = new THREE.Vector3();
      var _maxSpeed = 4;
      var _avoidWalls = true;

      this.setGoal = function ( target ) {

         _goal = target;

      }

      this.setWorldSize = function ( width, height, depth ) {

        _width = width;
        _height = height;
        _depth = depth;

      }

      this.setAvoidWalls = function ( value ) {

        _avoidWalls = value;

      }
      /*
      this.flock = function ( boids ) {

        //if ( _goal ) {

        _acceleration.addSelf( this.reach( this._goal, 0.0001)); //0.005) );

        //}

        //_acceleration.addSelf( this.alignment( boids ) );
        //_acceleration.addSelf( this.cohesion( boids ) );
        //_acceleration.addSelf( this.separation( boids ) );

      }

      this.reach = function ( target, amount ) {

        var steer = new THREE.Vector3();

        steer.sub( target, this.position );
        steer.multiplyScalar( amount );

        return steer;

      }
*/
      this.move = function () {
        this.velocity.addSelf( _acceleration );
        var l = this.velocity.length();

        if ( l > _maxSpeed ) {

          this.velocity.divideScalar( l / _maxSpeed );
        }
        // fake air resistance
        this.velocity.multiplyScalar(window.DRAG);

        this.position.addSelf( this.velocity );
        _acceleration.set( 0, 0, 0 );
        
      }
      this.gravitate = function () {
        _acceleration.addSelf (new THREE.Vector3(0,-window.GRAVITY,0));
      }

      this.PerlinMovement = function () {

        var x = this.position.x % SCREEN_WIDTH; 
        var y = this.position.y % SCREEN_HEIGHT;

        var size = 10;  // pick a scaling value
        var px = PerlinNoise.noise( size*x, 1, .1);
        var py = PerlinNoise.noise( 1, size*y, .1);

        var speed = .2;

        //console.log("px: "+ px + " py: "+py);

        _acceleration.addSelf(new THREE.Vector3((px-.5)*speed, (py-.5)*speed , 0));
      }

      this.turbulence = function () {
        //circular movement
        //_acceleration.addSelf( 0,0, 0 );
       var timeOffset = this.seed * Math.PI*2;
       var speed = 1;
       var driver = (timeOffset+counter)/speed;
       //blow particles up
       _acceleration.set(Math.sin(driver)/2, Math.cos(driver)/2+1, 0);
       // _acceleration.multiplyScalar( 1);
      }

      this.setblowAway = function (value) {
        this.blowAway = value;
      }

      this.rotate = function () {
        this.rotation.x += .01;
        this.rotation.y += .01;
        this.rotation.z += .01;
      }

      this.PerlinRotate = function () {
        // doesn't work
        var x = this.position.x % SCREEN_WIDTH; 
        var y = this.position.y % SCREEN_HEIGHT;
        //console.log("PerlinRotate: x: "+x + " y: "+y);
        var size = 100;  // pick a scaling value
        var rx = PerlinNoise.noise( size*x, 1, .1);
        var ry = PerlinNoise.noise( 1, size*y, .1);
       //console.log("PerlinRotate: rx: "+rx + " ry: "+ry);
        var speed =.09; //*this.velocity;

        this.rotation.x += rx*speed;//(Math.sin(counter/10)*_seed+_seed/2)/2;
        this.rotation.y += ry*speed;;//(Math.sin(counter/10)*_seed+_seed/2)/2;
        //this.rotation.z += speed * Math.sin(counter/10)*this.seed+this.seed/2);

      }

      this.followMouse = function () {
        //console.log ("mouse2D.x: "+mouse2D.x + " mouse2D.y: " +mouse2D.y )
        this.position = new THREE.Vector3 (mouse2D.x*SCREEN_WIDTH_HALF/6, mouse2D.y*SCREEN_HEIGHT_HALF/6, 0);

      }

      this.avoid = function ( target ) {

            var steer = new THREE.Vector3();

            steer.copy( this.position );
            steer.subSelf( target );

            steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

            return steer;

          }

      this.run = function ( particles ) {


        if (this.blowAway && counter/10%(this.ID+1)==0) {
            //console.log ("Particle.run() : counter: "+counter);
            this.blowAway = false;
            this.running = true;
           // console.log("Particle.run() : this.ID: "+this.ID);
            // GUSH
           _acceleration.set( Math.random()*20, Math.random()*10, 0);
        }


        if (this.running){
        //this.PerlinMovement();

        if ( _avoidWalls ) {
          var vector = new THREE.Vector3();
          vector.set( - _width, this.position.y, this.position.z );
          vector = this.avoid( vector );
          vector.multiplyScalar( 5 );
          _acceleration.addSelf( vector );

          vector.set( _width, this.position.y, this.position.z );
          vector = this.avoid( vector );
          vector.multiplyScalar( 5 );
          _acceleration.addSelf( vector );

          vector.set( this.position.x, - _height, this.position.z );
          vector = this.avoid( vector );
          vector.multiplyScalar( 5 );
          _acceleration.addSelf( vector );

          vector.set( this.position.x, _height, this.position.z );
          vector = this.avoid( vector );
          vector.multiplyScalar( 5 );
          _acceleration.addSelf( vector );

          vector.set( this.position.x, this.position.y, - _depth );
          vector = this.avoid( vector );
          vector.multiplyScalar( 5 );
          _acceleration.addSelf( vector );

          vector.set( this.position.x, this.position.y, _depth );
          vector = this.avoid( vector );
          vector.multiplyScalar( 5 );
          _acceleration.addSelf( vector );

        }

       //this.followMouse();
        this.PerlinRotate();
        this.move();
        this.gravitate();
        }
      }
      
    }
    // - - - - - - - - - - - - - - - - INIT PARTICLES - - - - - - - - - - - - - - - - -

    // Create sheets of paper
    particles = new Array();
    sheets = new Array();

    for (var k=0; k<PARTICLES_COUNT; k++){

      var p = particles [k] = new Particle();
      //START POSITION
      p.position = new THREE.Vector3(-40,-25-k*.5 + PARTICLES_COUNT*.5,0);
      p.ID = k;
      p.rotation.x = 90;
     //p.rotation.z = 45;

      p.setAvoidWalls( true );

      p.setWorldSize( 500, 500, 200 );
   
      // generate geometry
      var sheet = sheets[k] = new THREE.Mesh(new Hokusai( SHEET_WIDTH),new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false } ) );

      sheet.doubleSided = true;
      scene.add( sheet);
    }

   
    // - - - - - - - - - - - - - - - - END of INIT PARTICLES - - - - - - - - - - - - - - - - -

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  }

  function updateParticles (){
    
    for (var k in particles){
      
      if (counter==40) {
        particles[k].setblowAway(true);
        //particles[k]._goal = new THREE.Vector3 (Math.random()*100, Math.random()*100, Math.random()*10)
        //console.log("reposition")
      }
      var nextGush = 70+(Math.floor (particles[k].seed*40) );

      if (counter%nextGush < 2){
        //console.log("spiral")
        particles[k].turbulence();

      }
      
      
      sheets[k].position = particles[k].position;
      sheets[k].rotation = particles[k].rotation;

      particles[k].run();
    }
     counter++;
     //window.DRAG += window.DRAG-.01;
  }

  this.setAvoidWalls = function ( value ) {
     _avoidWalls = value;
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
    camera.lookAt( scene.position );

    renderer.render( scene, camera );
  }
  function onDocumentMouseMove(event) {

    mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

     for (var k in particles){
      //vector.z = particles[k].position.z;
      //particles[k].repulse( vector);

    }

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
});
