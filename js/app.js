$(function() {

  var mouse2D = { x: 0, y: 0 },

  PARTICLES_COUNT = 40, 
  SHEET_WIDTH = 6,
  SHEET_SUBDIVISIONS = 10,
  //START_POSITION = new THREE.Vector3 (-40,-25,0),

  SCREEN_WIDTH = $(".container").width(),
  SCREEN_HEIGHT = 682,
  SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
  SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2,

  camera, scene, renderer, projector, orbitRadius, theta, counter, particles, sheets;

  window.DRAG = .95;
  window.GRAVITY = .01;

  init();
  animate();

  
  function init() {

    //SCENE
    scene = new THREE.Scene();
   
    //CAMERA
    camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    camera.position.y = -5;
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
      this.ID =0;
      this.position = new THREE.Vector3();
      this.velocity = new THREE.Vector3();
      this.rotation = new THREE.Vector3();
      this.seed = Math.random();
      this.goal = new THREE.Vector3 (100,0,0);
      this.running = false;
      this.displace = false;
      this.decay = 1;

      var  _width = 500, _height = 500, _depth = 200;
      var _acceleration = new THREE.Vector3();
      var _maxSpeed = 4;
      var _avoidWalls = false;

      this.setGoal = function ( target ) {

         _goal = target;

      }
      this.setDisplace = function (bool) {
        displace = bool;
      }

      this.setblowAway = function (bool) {
        this.blowAway = bool;
      }

      this.setWorldSize = function ( width, height, depth ) {

        _width = width;
        _height = height;
        _depth = depth;

      }

      this.setAvoidWalls = function ( bool ) {

        _avoidWalls = bool;

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
        this.velocity.multiplyScalar(window.DRAG + this.seed*.03);

        this.position.addSelf( this.velocity );
        _acceleration.set( 0, 0, 0 );
        
      }
      this.gravitate = function () {
        _acceleration.addSelf (new THREE.Vector3(0,-window.GRAVITY*this.decay,0));
      }
      /*
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
       _acceleration.set(Math.sin(driver)/2*this.decay, (Math.cos(driver)/2+1)*this.decay, 0);
       // _acceleration.multiplyScalar( 1);
      }
    
      

      this.rotate = function () {
        this.rotation.x += .01 * this.decay;
        this.rotation.y += .01 * this.decay;
        this.rotation.z += .01 * this.decay;

      }
*/
      this.PerlinRotate = function () {
        // doesn't work
        var x = this.position.x % SCREEN_WIDTH; 
        var y = this.position.y % SCREEN_HEIGHT;
        //console.log("PerlinRotate: x: "+x + " y: "+y);
        var size = 100;  // pick a scaling value
        var rx = PerlinNoise.noise( size*x, 1, .1);
        var ry = PerlinNoise.noise( 1, size*y, .1);
       //console.log("PerlinRotate: rx: "+rx + " ry: "+ry);
        var speed =.09 * this.seed; //*this.velocity;

        this.rotation.x += rx*speed *this.decay;
        this.rotation.y += ry*speed *this.decay; 
        this.rotation.z += .02 * this.seed * this.decay;

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

        // blow away
        // one after the other
        // many in the beginning
        if (this.blowAway && (counter*30-counter) % (this.ID+1) == 0) {
            //console.log ("Particle.run() : counter: "+counter);
            this.blowAway = false;
            this.running = true;
           
            //console.log("Particle.run() : this.ID: "+this.ID);
            // GUSH
            var xSpread = 10;
            var ySpread = 5;
            var xGush = (Math.random()+.5)*xSpread + (this.ID+1) / PARTICLES_COUNT;
            var yGush = (Math.random()+.5)*ySpread + (this.ID+1) / PARTICLES_COUNT;
           // console.log("Particle.run() : xGush "+xGush + " yGush "+yGush);
            this.velocity.set( xGush, yGush, (Math.random()+.5)*4);
            this.setDisplace(true);
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

          if (this.decay > 0){
            this.decay -= .005;
          } else {
            this.decay = 0;
          }
        }
      }
    }
    // - - - - - - - - - - - - - - - - INIT PARTICLES - - - - - - - - - - - - - - - - -

    particles = new Array();
    sheets = new Array();

    for (var k=0; k<PARTICLES_COUNT; k++){

      var p = particles [k] = new Particle();

      //START POSITION
      p.position =  new THREE.Vector3(-40,-20- 4/PARTICLES_COUNT*k, 0); //new THREE.Vector3(); //
      p.ID = k;
      p.rotation.x = 90;
     

      //p.setAvoidWalls( true );
      p.setWorldSize( 500, 500, 200 );
   
      // generate geometry
      var sheet = sheets[k] = new THREE.Mesh(new Hokusai( SHEET_WIDTH, SHEET_SUBDIVISIONS),new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false } ) );

      sheet.doubleSided = true;
      scene.add( sheet);
    }

   
    // - - - - - - - - - - - - - - - - END of INIT PARTICLES - - - - - - - - - - - - - - - - -

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  }

  // - - - - - - - - - - - - - - - - UPDATE PARTICLES - - - - - - - - - - - - - - - - -

  function updateParticles (){
    
    for (var k in particles){
      // blow 'em away
      if (counter==40) {
        particles[k].setblowAway(true);
      }

      /*
      var nextGush = 70+(Math.floor (particles[k].seed*40) );
      if (counter%nextGush < 2){
        //console.log("spiral")
        particles[k].turbulence();

      }
      */
      
      
      sheets[k].position = particles[k].position;
      sheets[k].rotation = particles[k].rotation;

      if (this.displace){
        //update geo
        var l = sheets[k].geometry.vertices.length;
        var i=0;
        while (i < l){
            var s = sheets[k].geometry.vertices[i];
            var p = particles[k];
            var displaceDepth = .6;
            //offset  wave displace
            if (i%2==0){
              s.z = Math.sin( counter* p.decay/10 + Math.PI*2*i/l* p.seed) * displaceDepth ;
            } else {
              s.z = Math.cos( counter* p.decay/10 + Math.PI*2*i/l* p.seed) * displaceDepth ;
            }


            i++;
        }
     }

      particles[k].run();
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
    camera.lookAt( scene.position );

    renderer.render( scene, camera );
  }

  function onDocumentMouseMove(event) {

    mouse2D.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse2D.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

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
