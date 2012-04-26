$(function() {

  var mouse2D = { x: 0, y: 0 },

  PARTICLES_COUNT = 45, 
  SHEET_WIDTH =4,
  SHEET_SUBDIVISIONS = 7,
  DISPLACE_DEPTH = 1,
  START_FRAME = 40,
  TEXTURE_PATH = "images/paper_64x64.png",
  //START_POSITION = new THREE.Vector3 (-40,-25,0),

  SCREEN_WIDTH = $(".container").width(),
  SCREEN_HEIGHT = 682,
  SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
  SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2,

  camera, scene, renderer, projector, orbitRadius, theta, counter, particles, sheets;

  window.DRAG = .95;
  window.GRAVITY = .005;

  
  init();
  animate();
  
  function init() {
     console.log("app.js: init()");
    //SCENE
    scene = new THREE.Scene();
   
    //CAMERA
    camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    camera.position.y = -5;
    camera.position.x = 0;
    camera.position.z = 150;
    scene.add( camera );

    //CUBE
    /*var cube = new THREE.Mesh(
      new THREE.CubeGeometry( 80, 50, 50),
      new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe: false,  opacity: .3, blending: THREE.AdditiveBlending, overdraw: true , doubleSided: true } )
    );
    cube.doubleSided = true;
    scene.add( cube );*/

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

      var _acceleration = new THREE.Vector3();
      var _maxSpeed = 4;
      //var _avoidWalls = false;

      this.setGoal = function ( target ) {

         _goal = target;

      }
      this.setDisplace = function (bool) {
        this.displace = bool;
      }

      this.setblowAway = function (bool) {
        this.blowAway = bool;
      }

      this.followMouse = function () {
        //console.log ("mouse2D.x: "+mouse2D.x + " mouse2D.y: " +mouse2D.y )
        this.position = new THREE.Vector3 (mouse2D.x*SCREEN_WIDTH_HALF/6, mouse2D.y*SCREEN_HEIGHT_HALF/6, 0);

      }
      this.rotate = function () {
        this.rotation.x = (Math.sin(this.position.x/10)+1)*2;
        this.rotation.y = (Math.sin(this.position.y/10)+1)*2;
        this.rotation.z = (Math.cos(this.position.y/10)+1+Math.sin(this.position.x/10)+1)*2;

      }

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
        _acceleration.addSelf (new THREE.Vector3(0,-window.GRAVITY*this.decay*(this.seed*.3+.7),0));
      }
      
      this.run = function ( particles ) {

        // blow away
        // one after the other
        // many in the beginning
        //if (this.blowAway && (counter*40-counter) % (this.ID+1) == 0) {
        if (this.blowAway && this.ID < counter - START_FRAME) {
           
            this.blowAway = false;
            this.running = true;
            this.setDisplace(true);
           
          
            // GUSH
            var xSpread = 1;
            var ySpread = .5;
            var xGush = (Math.random()+.5)*xSpread + (this.ID+1) / PARTICLES_COUNT;
            var yGush = (Math.random()+.5)*ySpread + (this.ID+1) / PARTICLES_COUNT;
           
            this.velocity.set( xGush, yGush, (Math.random()+.5)*xSpread);
            
        }


        if (this.running){
          
         //this.followMouse();
          this.rotate();
          this.move();
          this.gravitate();

          /*
          if (this.decay > 0){
            this.decay -= .005;
          } else {
            this.decay = 0;
          }
          */
        }
      }
    }
    // - - - - - - - - - - - - - - - - INIT PARTICLES - - - - - - - - - - - - - - - - -

    particles = new Array();
    sheets = new Array();

    for (var k=0; k<PARTICLES_COUNT; k++){

      var p = particles [k] = new Particle();

      //START POSITION
      p.position = new THREE.Vector3(-40,-20- 4/PARTICLES_COUNT*k, 0);
      p.rotation.x = 90;
      p.rotation.z = Math.random() * .4;
      p.ID = k;
    
      var texture =THREE.ImageUtils.loadTexture( TEXTURE_PATH);
      texture.magFilter = texture.minFilter =  THREE.LinearFilter;

      var material = new THREE.MeshBasicMaterial( { map: texture, doubleSided: true, overdraw:true, wireframe:false })
      //material.needsUpdate = true;
      // TESTING
      //p.rotation.x = 0;
      //p.position.x = 1/PARTICLES_COUNT*k;
      //if (k%2==0) texture = undefined;

      // generate geometry
      var sheet = sheets[k] = new THREE.Mesh(
                              new Hokusai( SHEET_WIDTH, SHEET_SUBDIVISIONS),
                              material
                              );
   
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
       var p = particles[k];

      // blow 'em away
      if (counter== START_FRAME) {
        //particles[k].running = true;
        p.setblowAway(true);
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

      // - - - - - - - - - - - - - - - - MESH DISPLACEMENT  - - - - - - - - - - - - - - - 

      if (p.displace){
        var l = sheets[k].geometry.vertices.length;
        var i=0;
        while (i < l){
            var s = sheets[k].geometry.vertices[i];
           
         
            // offset wave displace per vertice
            // and per particle
            if (i%2==0){
              s.z = Math.sin( (counter+ p.seed) * p.decay / 10 + Math.PI*2* i/l * p.seed) * DISPLACE_DEPTH ;
            } else {
              s.z = Math.cos( (counter+ p.seed) * p.decay / 10 + Math.PI*2* i/l * p.seed) * DISPLACE_DEPTH ;
            }


            i++;
        }
     }
      // - - - - - - - - - - - - - - - - MESH DISPLACEMENT  - - - - - - - - - - - - - - - 

      p.run();
    }
     counter++;
  }


  function animate() {
    //console.log("app.js: animate()");
    

   

    if (counter < 500){
      requestAnimationFrame( animate );
      render();
    } else if (counter == 250){
        console.log("stop rendering");

    }
  }

  function render() {
    //console.log("app.js: render()");
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
