$(function() {

  var mouse2D = { x: 0, y: 0 },

  PARTICLES_COUNT = 45, 
  SHEET_WIDTH =4,
  SHEET_SUBDIVISIONS = 7,
  DISPLACE_DEPTH = 1,
  START_FRAME = 40,
  TEXTURE_PATH = "images/paper_64x64.png",
  //START_POSITION = new THREE.Vector3 (-60,-25,0),
  START_POSITION = new THREE.Vector3 (-50,40,0),
  

  camera, scene, renderer, projector, orbitRadius, theta, counter, particles, sheets;

  window.DRAG = .95;
  window.GRAVITY = .005;

  var names= ['Aaron', 'Amanda', 'Angela','Aitor', 'Eric','Genis','Genn','Hakan','Nas','Nelson','Rob'];

  var $portraits = $('#portraits');
  var $portraitImages = $('#portrait-images');
  var $portraitCovers = $('#portrait-covers');

  addPortraits ();

  SCREEN_WIDTH = $("body").width(),
  SCREEN_HEIGHT = $("body").height(),
  SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
  SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2,

  init();
  animate();
  
  function init() {

    //SCENE
    scene = new THREE.Scene();
   
    //CAMERA
    camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    camera.position.y = -5;
    camera.position.x = 0;
    camera.position.z = 350; //150
    scene.add( camera );

    //RENDERER
    projector = new THREE.Projector();
    renderer = new THREE.CanvasRenderer();
    renderer.sortObjects = false;
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    //DOM
    var container = document.createElement('div');
    $("#hokusai").append(container);
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
      p.position = new THREE.Vector3(START_POSITION.x,START_POSITION.y - 4/PARTICLES_COUNT*k, 0);
      p.rotation.x = 90;
      p.rotation.z = Math.random() * .4;
      p.ID = k;
    
      var texture =THREE.ImageUtils.loadTexture( TEXTURE_PATH);
      texture.magFilter = texture.minFilter =  THREE.LinearFilter;

      //var material = new THREE.MeshBasicMaterial( { map: texture, doubleSided: true,  wireframe:false })
      var material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF,  wireframe:false, overdraw:true })


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

      p.run();
    }
     counter++;
  }


  function animate() {
    //console.log("app.js: animate()");
     render();

   
     
    if (counter < 2500){
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

  function addPortraits() {
    

    for (var k in names){
      $portraitImages.append('<img class="portrait" src="images/portraits/'+names[k]+'.jpg" />');
      $portraitCovers.append('<div class="portrait-cover"><p>'+names[k]+'</p></div>');
    }
    var h = Math.ceil(names.length /4)*350;
    $portraits.css('height', h);
  }
  
  $(window).scroll(function () {
   

    //portrait covers fade in & fade out
    var portraitsHeight = $portraits.height();
    var y = $portraits.position().top;
     console.log('app.js: window.scroll: y: '+y);
    var offset = $(window).scrollTop() - y + $(window).height()/2;
    console.log('app.js: window.scroll: offset: '+offset);
    var portraitsPct = offset/portraitsHeight;

    portraitsPct *=  1.2;
    console.log('app.js: window.scroll: portraitsPct: '+Math.floor (portraitsPct*100));

    var emptyPortraits = 4 - names.length%4;

    var c = 0;
    $portraitCovers.children().each(function () {
      $(this).css ('opacity', fadeMe (portraitsPct, 5, c/(names.length+emptyPortraits)));
      c ++;
    });

    //counter = $(window).scrollTop();
    //counter++;
    //console.log('app.js: window.scroll: counter: '+ counter);
    //animate();
  });

  $(window).resize(function() {
    console.log('$(window).resize: width:' +$(window).width() + ' height: '+$(window).height())
    START_POSITION = new THREE.Vector3 (0,0,0);

    SCREEN_WIDTH = $(window).width();
    SCREEN_HEIGHT = $(window).height();
    SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2;
    SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

  });

  var fadeMe = function (pct, fadeSteps, startFade) {
    fadeSteps = fadeSteps/100;
    startFadeOut = startFade+fadeSteps;
    var o;
      if (pct > startFade && pct < startFade+fadeSteps){
        o = (pct - startFade)/fadeSteps;
      } else if (pct >= startFade+fadeSteps && pct < startFadeOut) {
        o = 1;
      } else if (pct >= startFadeOut && pct < startFadeOut+fadeSteps) {
        o = 1-(pct - startFadeOut)/fadeSteps;
      } else {
        o = 0;
      }
      return o;
  };
});
